import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Icon } from '../../internal/Icon';
import { StatusIcon } from '../../internal/StatusIcon';
import type { IconName } from '../../internal/iconPaths';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import { Input } from '../Input';
import { Menu } from '../Menu';
import { Popover } from '../Popover';
import styles from './RichTextEditor.module.css';

export interface RichTextEditorHandle {
  /** The editor's content as HTML. */
  getHTML: () => string;
  /** Plain text, for counting or previews. */
  getText: () => string;
  focus: () => void;
}

/** Parts you can style with `classNames` and `styles`. */
export type RichTextEditorPart = 'root' | 'toolbar' | 'group' | 'divider' | 'body' | 'placeholder' | 'content';

export interface RichTextEditorProps extends PartsProps<RichTextEditorPart> {
  /** Starting content as HTML. The editor keeps its own state after that. */
  defaultValue?: string;
  /** Called with the new HTML after each change. */
  onChange?: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Small for phones and narrow panels: tighter padding, and the toolbar scrolls sideways in one row. Text and buttons keep their size so they stay easy to read and tap. Figma: Size. */
  size?: 'sm' | 'md';
  /** Toolbar groups to show. Figma: Text style, Format, Blocks, Insert, History. */
  tools?: Partial<Record<'textStyle' | 'format' | 'blocks' | 'insert' | 'history', boolean>>;
  /** Minimum height of the writing area in px. */
  minHeight?: number;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  className?: string;
}

type Command = { cmd: string; arg?: string; icon: IconName; label: string; shortcut?: string; state?: string };

const FORMAT: Command[] = [
  { cmd: 'bold', icon: 'TextB', label: 'Bold', shortcut: 'Ctrl+B' },
  { cmd: 'italic', icon: 'TextItalic', label: 'Italic', shortcut: 'Ctrl+I' },
  { cmd: 'underline', icon: 'TextUnderline', label: 'Underline', shortcut: 'Ctrl+U' },
  { cmd: 'strikeThrough', icon: 'TextStrikethrough', label: 'Strikethrough' },
];
const BLOCKS: Command[] = [
  { cmd: 'insertUnorderedList', icon: 'ListBullets', label: 'Bulleted list' },
  { cmd: 'insertOrderedList', icon: 'ListNumbers', label: 'Numbered list' },
  { cmd: 'formatBlock', arg: 'blockquote', icon: 'Quotes', label: 'Quote', state: 'blockquote' },
  { cmd: 'formatBlock', arg: 'pre', icon: 'Code', label: 'Code block', state: 'pre' },
];
const TEXT_STYLES = [
  { tag: 'p', label: 'Normal text' },
  { tag: 'h2', label: 'Heading 1' },
  { tag: 'h3', label: 'Heading 2' },
];

/**
 * A writing area with a formatting toolbar. Content is HTML; sanitise it on the server before showing it to others.
 * Built on the browser's editing support, so it needs no extra packages. For collaborative or schema-based
 * editing, use a dedicated editor library styled with Halo tokens.
 */
export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor(
  { defaultValue = '', onChange, placeholder = 'Start writing…', invalid, disabled, size = 'md', tools = {}, minHeight = size === 'sm' ? 120 : 160, id, className, classNames, styles: partStyles, ...aria },
  ref,
) {
  const area = useRef<HTMLDivElement | null>(null);
  const saved = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [block, setBlock] = useState('p');
  const [empty, setEmpty] = useState(!defaultValue);
  const show = { textStyle: true, format: true, blocks: true, insert: true, history: true, ...tools };

  useImperativeHandle(ref, () => ({
    getHTML: () => area.current?.innerHTML ?? '',
    getText: () => area.current?.innerText ?? '',
    focus: () => area.current?.focus(),
  }));

  // Only the first value is used: the editor owns its content afterwards.
  const initial = useRef(defaultValue);
  useEffect(() => {
    if (area.current) area.current.innerHTML = initial.current;
  }, []);

  const refresh = useCallback(() => {
    const sel = document.getSelection();
    if (!sel || !area.current || !sel.rangeCount || !area.current.contains(sel.anchorNode)) return;
    saved.current = sel.getRangeAt(0).cloneRange();
    const next: Record<string, boolean> = {};
    for (const c of FORMAT) next[c.cmd] = document.queryCommandState(c.cmd);
    next.insertUnorderedList = document.queryCommandState('insertUnorderedList');
    next.insertOrderedList = document.queryCommandState('insertOrderedList');
    const tag = String(document.queryCommandValue('formatBlock') || 'p').toLowerCase();
    next.blockquote = tag === 'blockquote';
    next.pre = tag === 'pre';
    setActive(next);
    setBlock(TEXT_STYLES.some((t) => t.tag === tag) ? tag : 'p');
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refresh);
    return () => document.removeEventListener('selectionchange', refresh);
  }, [refresh]);

  const changed = () => {
    const el = area.current;
    if (!el) return;
    setEmpty(!el.innerText.trim() && !el.querySelector('img'));
    onChange?.(el.innerHTML);
  };

  // Put the caret back where it was before a toolbar control took focus, then run the command.
  const run = (cmd: string, arg?: string) => {
    if (disabled) return;
    const el = area.current;
    if (!el) return;
    el.focus();
    const sel = document.getSelection();
    if (saved.current && sel) {
      sel.removeAllRanges();
      sel.addRange(saved.current);
    }
    document.execCommand(cmd, false, arg);
    refresh();
    changed();
  };

  const toggleBlock = (c: Command) => {
    if (c.cmd === 'formatBlock' && c.state && active[c.state]) run('formatBlock', 'p');
    else run(c.cmd, c.arg);
  };

  const tool = (c: Command, on: boolean, onClick: () => void) => (
    <CompactButton
      key={c.label}
      variant="ghost"
      aria-label={c.label}
      title={c.shortcut ? `${c.label} (${c.shortcut})` : c.label}
      aria-pressed={on}
      selected={on}
      disabled={disabled}
      // Keep the text selection when clicking a toolbar button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Icon name={c.icon} />
    </CompactButton>
  );

  const part = parts<RichTextEditorPart>('rich-text-editor', { classNames, styles: partStyles });
  const divider = (key: string) => <span key={key} {...part('divider', styles.divider)} aria-hidden="true" />;

  return (
    <div {...part('root', [styles.editor, size === 'sm' && styles.sm, invalid || aria['aria-invalid'] ? styles.invalid : undefined, disabled && styles.disabled, className])}>
      <div role="toolbar" aria-label="Formatting" aria-controls={id} {...part('toolbar', styles.toolbar)}>
        {show.textStyle && (
          <>
            <Menu
              aria-label="Text style"
              trigger={
                <Button variant="ghost" size="xs" disabled={disabled} iconRight={<Icon name="CaretDown" />} onMouseDown={(e) => e.preventDefault()}>
                  {TEXT_STYLES.find((t) => t.tag === block)?.label ?? 'Normal text'}
                </Button>
              }
              items={TEXT_STYLES.map((t) => ({ label: t.label, selected: t.tag === block, onSelect: () => run('formatBlock', t.tag) }))}
            />
            {divider('d1')}
          </>
        )}
        {show.format && <div {...part('group', styles.group)}>{FORMAT.map((c) => tool(c, !!active[c.cmd], () => run(c.cmd)))}</div>}
        {show.format && (show.blocks || show.insert) && divider('d2')}
        {show.blocks && <div {...part('group', styles.group)}>{BLOCKS.map((c) => tool(c, !!active[c.state ?? c.cmd], () => toggleBlock(c)))}</div>}
        {show.blocks && show.insert && divider('d3')}
        {show.insert && (
          <div {...part('group', styles.group)}>
            <UrlPopover label="Link" icon="Link" placeholder="https://" disabled={disabled} onApply={(url) => run('createLink', url)} />
            <UrlPopover label="Image" icon="Image" placeholder="Image address" disabled={disabled} onApply={(url) => run('insertImage', url)} />
          </div>
        )}
        <span className={styles.spacer} />
        {show.history && (
          <div {...part('group', styles.group)}>
            {tool({ cmd: 'undo', icon: 'ArrowCounterClockwise', label: 'Undo', shortcut: 'Ctrl+Z' }, false, () => run('undo'))}
            {tool({ cmd: 'redo', icon: 'ArrowClockwise', label: 'Redo', shortcut: 'Ctrl+Y' }, false, () => run('redo'))}
          </div>
        )}
      </div>
      <div {...part('body', styles.contentWrap)}>
        {empty && <div {...part('placeholder', styles.placeholder)} aria-hidden="true">{placeholder}</div>}
        <StatusIcon className={styles.status} invalid={invalid || !!aria['aria-invalid']} disabled={disabled} />
        <div
          ref={area}
          id={id}
          role="textbox"
          aria-multiline="true"
          aria-label={aria['aria-label']}
          aria-labelledby={aria['aria-labelledby']}
          aria-describedby={aria['aria-describedby']}
          aria-invalid={invalid || aria['aria-invalid'] || undefined}
          aria-disabled={disabled || undefined}
          aria-placeholder={placeholder}
          contentEditable={!disabled}
          suppressContentEditableWarning
          {...part('content', styles.content, { minHeight })}
          onInput={changed}
          onKeyUp={refresh}
          onMouseUp={refresh}
        />
      </div>
    </div>
  );
});

function UrlPopover({ label, icon, placeholder, disabled, onApply }: { label: string; icon: IconName; placeholder: string; disabled?: boolean; onApply: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const apply = () => {
    const clean = url.trim();
    // Only allow web and mail links, never javascript: or data: addresses.
    if (/^(https?:\/\/|mailto:)/i.test(clean)) onApply(clean);
    setOpen(false);
    setUrl('');
  };
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      arrow={false}
      showClose={false}
      align="start"
      title={`Add ${label.toLowerCase()}`}
      trigger={
        <CompactButton variant="ghost" aria-label={`Add ${label.toLowerCase()}`} disabled={disabled} onMouseDown={(e) => e.preventDefault()}>
          <Icon name={icon} />
        </CompactButton>
      }
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={apply}>Add</Button>
        </>
      }
    >
      <Input
        size="sm"
        aria-label={`${label} address`}
        placeholder={placeholder}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            apply();
          }
        }}
      />
    </Popover>
  );
}

export interface RichTextEditorFieldProps extends Omit<RichTextEditorProps, 'aria-describedby' | 'aria-invalid' | 'aria-labelledby'>, Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> {
  required?: boolean;
  /** Shows a character count, with this as the limit. Figma: Count. */
  maxLength?: number;
  fieldClassName?: string;
  fieldClassNames?: FieldWrapperProps['fieldClassNames'];
  fieldStyles?: FieldWrapperProps['fieldStyles'];
}

/** A RichTextEditor with a label, hint and optional character count. */
export const RichTextEditorField = forwardRef<RichTextEditorHandle, RichTextEditorFieldProps>(function RichTextEditorField(
  { label, hint, error, optional, info, required, id, maxLength, fieldClassName, fieldClassNames, fieldStyles, onChange, defaultValue, ...rest },
  ref,
) {
  // Counts the visible text without the DOM, so the server and the browser get the same number
  const textOf = (html: string) =>
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&(lt|gt|quot|#39|amp);/g, (_, e: string) => ({ lt: '<', gt: '>', quot: '"', '#39': "'", amp: '&' })[e] ?? '');
  const [length, setLength] = useState(() => textOf(defaultValue ?? '').length);
  const tooLong = maxLength !== undefined && length > maxLength;
  const count: ReactNode = maxLength !== undefined ? `${length}/${maxLength}` : undefined;
  return (
    <Field
      label={label}
      hint={hint}
      error={error ?? (tooLong ? `Keep it under ${maxLength} characters.` : undefined)}
      required={required}
      optional={optional}
      info={info}
      count={count}
      controlId={id}
      className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}
    >
      {(c) => (
        <RichTextEditor
          ref={ref}
          {...rest}
          {...c}
          defaultValue={defaultValue}
          onChange={(html) => {
            setLength(textOf(html).length);
            onChange?.(html);
          }}
        />
      )}
    </Field>
  );
});
