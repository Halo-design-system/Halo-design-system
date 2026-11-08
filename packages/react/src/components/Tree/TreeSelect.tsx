import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { mergeRefs, Portal, useDismiss, useFloating } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { StatusIcon } from '../../internal/StatusIcon';
import { useControllable } from '../../internal/useControllable';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import { useWrapped } from '../../internal/useWrapped';
import inputStyles from '../Input/Input.module.css';
import menuStyles from '../Menu/Menu.module.css';
import selectStyles from '../Select/Select.module.css';
import { Tag } from '../Tag';
import { findTreeNode, Tree } from './Tree';
import type { TreeNode } from './Tree';
import own from './TreeSelect.module.css';

/** Parts you can style with `classNames` and `styles`. The tree opens in a layer over the page. */
export type TreeSelectPart = 'root' | 'icon' | 'value' | 'values' | 'caret' | 'popover' | 'search' | 'tree' | 'empty';

interface TreeSelectBase extends PartsProps<TreeSelectPart> {
  nodes: TreeNode[];
  placeholder?: string;
  /** Shows a search box above the tree. Figma: Search. */
  search?: boolean;
  /** Branches open when the tree first shows. */
  defaultExpanded?: string[];
  /** Icon at the start of the box. Figma: L icon. */
  icon?: ReactNode;
  /** 32, 40 or 48px. Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  /** Form field name. A hidden input carries the value; several values are joined with commas. */
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
  className?: string;
}

export interface TreeSelectProps extends TreeSelectBase {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
}

export interface MultiTreeSelectProps extends TreeSelectBase {
  /** Checkboxes, and tags in the box. Checking a branch picks everything inside it. Figma: Type=Multiple. */
  multiple: true;
  /** Ids of the picked leaves. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  const out: TreeNode[] = [];
  for (const n of nodes) {
    const kids = n.children ? filterTree(n.children, q) : [];
    if (n.label.toLowerCase().includes(q) || kids.length) out.push({ ...n, children: kids.length ? kids : n.label.toLowerCase().includes(q) ? n.children : undefined });
  }
  return out;
}

const branchIds = (nodes: TreeNode[]): string[] => nodes.flatMap((n) => (n.children?.length ? [n.id, ...branchIds(n.children)] : []));

/** Picks from nested options, like a category inside a department. Single, or several with checkboxes. Figma: Tree select. */
export const TreeSelect = forwardRef<HTMLButtonElement, TreeSelectProps | MultiTreeSelectProps>(function TreeSelect(props, ref) {
  const { nodes, placeholder = 'Select', search = false, defaultExpanded = [], icon, size = 'md', invalid, disabled, name, id, className, classNames, styles: partStyles, required } = props;
  const multiple = props.multiple === true;
  const part = parts<TreeSelectPart>('tree-select', { classNames, styles: partStyles });
  const popId = useId();

  const [single, setSingle] = useControllable<string | null>(
    multiple ? undefined : (props as TreeSelectProps).value,
    multiple ? null : ((props as TreeSelectProps).defaultValue ?? null),
    multiple ? undefined : ((props as TreeSelectProps).onValueChange as (v: string | null) => void),
  );
  const [many, setMany] = useControllable<string[]>(
    multiple ? (props as MultiTreeSelectProps).value : undefined,
    multiple ? ((props as MultiTreeSelectProps).defaultValue ?? []) : [],
    multiple ? (props as MultiTreeSelectProps).onValueChange : undefined,
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);
  const anchor = useRef<HTMLElement | null>(null);
  useWrapped(anchor);
  const button = useRef<HTMLButtonElement | null>(null);
  const { floating, style } = useFloating(anchor, open, { matchWidth: true });
  const close = () => {
    setOpen(false);
    setQuery('');
    button.current?.focus();
  };
  useDismiss(open, close, [anchor, floating]);

  const q = query.trim().toLowerCase();
  const shown = useMemo(() => (q ? filterTree(nodes, q) : nodes), [nodes, q]);
  const isInvalid = invalid || !!props['aria-invalid'];
  const chosen = !multiple && single ? findTreeNode(nodes, single) : undefined;

  // Put focus in the layer when it opens: the search box, or the chosen row
  useEffect(() => {
    if (!open) return;
    const el = floating.current;
    const target = (search ? el?.querySelector('input') : el?.querySelector('[role="treeitem"][tabindex="0"]')) as HTMLElement | null;
    target?.focus();
  }, [open, search, floating]);

  const openKey = (e: KeyboardEvent) => {
    if (!open && ['ArrowDown', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    } else if (multiple && e.key === 'Backspace' && many.length) {
      e.preventDefault();
      setMany(many.slice(0, -1));
    }
  };

  const tree = (
    <Tree
      {...part('tree')}
      nodes={shown}
      size={size === 'lg' ? 'md' : 'sm'}
      expanded={q ? branchIds(shown) : expanded}
      onExpandedChange={(next) => !q && setExpanded(next)}
      checkable={multiple}
      checked={multiple ? many : undefined}
      onCheckedChange={multiple ? setMany : undefined}
      selected={multiple ? undefined : single}
      onSelectedChange={
        multiple
          ? undefined
          : (v) => {
              setSingle(v);
              close();
            }
      }
      aria-label={props['aria-label'] ?? placeholder}
      onKeyDown={(e) => {
        if (e.key === 'Tab') setOpen(false);
      }}
    />
  );

  const popover = open && (
    <Portal>
      <div ref={floating} id={popId} role="dialog" aria-label={props['aria-label'] ?? placeholder} {...part('popover', [menuStyles.menu, own.popover], style)}>
        {search && (
          <div className={own.searchBox}>
            <Icon name="MagnifyingGlass" className={own.searchIcon} />
            <input
              {...part('search', own.search)}
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  (floating.current?.querySelector('[role="treeitem"]') as HTMLElement | null)?.focus();
                }
              }}
            />
          </div>
        )}
        {shown.length ? tree : <div {...part('empty', own.empty)}>No matches</div>}
      </div>
    </Portal>
  );

  if (!multiple) {
    return (
      <>
        <button
          ref={mergeRefs(ref, button, anchor as RefObject<HTMLButtonElement | null>)}
          id={id}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popId : undefined}
          aria-invalid={isInvalid || undefined}
          // The name says what the field is and what it shows, like "Team, Design", so it matches what people see
          aria-label={props['aria-label'] ? [props['aria-label'], typeof (chosen?.label ?? placeholder) === 'string' ? chosen?.label ?? placeholder : null].filter(Boolean).join(', ') : undefined}
          aria-describedby={props['aria-describedby']}
          aria-required={required || undefined}
          disabled={disabled}
          {...part('root', [inputStyles.box, inputStyles[size], selectStyles.trigger, isInvalid && inputStyles.invalid, disabled && inputStyles.disabled, className])}
          onClick={() => (open ? close() : setOpen(true))}
          onKeyDown={openKey}
        >
          {(chosen?.icon ?? icon) && <span {...part('icon', inputStyles.icon)} aria-hidden="true">{chosen?.icon ?? icon}</span>}
          <span {...part('value', [selectStyles.value, !chosen && selectStyles.placeholder])}>{chosen?.label ?? placeholder}</span>
          <StatusIcon invalid={isInvalid} disabled={disabled} />
          <Icon name="CaretDown" {...part('caret', [selectStyles.caret, open && selectStyles.caretOpen])} />
        </button>
        {name && <input type="hidden" name={name} value={single ?? ''} />}
        {popover}
      </>
    );
  }

  const picked = many.map((v) => findTreeNode(nodes, v)).filter((n): n is TreeNode => !!n);
  return (
    <>
      <div
        ref={anchor as RefObject<HTMLDivElement | null>}
        {...part('root', [inputStyles.box, inputStyles[size], selectStyles.combobox, selectStyles.multiple, own.multi, isInvalid && inputStyles.invalid, disabled && inputStyles.disabled, className])}
        onClick={(e) => {
          if (disabled || (e.target as HTMLElement).closest('button')) return;
          setOpen(true);
        }}
      >
        {icon && <span {...part('icon', [inputStyles.icon, own.multiIcon])} aria-hidden="true">{icon}</span>}
        <div {...part('values', selectStyles.values)}>
          {picked.map((n) => (
            <Tag key={n.id} size={size === 'sm' ? 'sm' : 'md'} disabled={disabled} removeLabel={`Remove ${n.label}`} onRemove={() => setMany(many.filter((v) => v !== n.id))}>
              {n.label}
            </Tag>
          ))}
          <button
            ref={mergeRefs(ref, button)}
            type="button"
            id={id}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? popId : undefined}
            aria-label={props['aria-label'] ? `${props['aria-label']}, ${picked.length} selected` : undefined}
            aria-describedby={props['aria-describedby']}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            disabled={disabled}
            {...part('value', [own.multiButton, !picked.length && selectStyles.placeholder, !icon && selectStyles.textStart])}
            onClick={() => (open ? close() : setOpen(true))}
            onKeyDown={openKey}
          >
            {picked.length ? <span className={own.srOnly}>{placeholder}</span> : placeholder}
          </button>
        </div>
        <StatusIcon invalid={isInvalid} disabled={disabled} />
        <Icon name="CaretDown" {...part('caret', [selectStyles.caret, open && selectStyles.caretOpen])} />
      </div>
      {name && <input type="hidden" name={name} value={many.join(',')} />}
      {popover}
    </>
  );
});

export type TreeSelectFieldProps = (Omit<TreeSelectProps, 'aria-describedby' | 'aria-invalid'> | Omit<MultiTreeSelectProps, 'aria-describedby' | 'aria-invalid'>) &
  Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> & {
    fieldClassName?: string;
    fieldClassNames?: FieldWrapperProps['fieldClassNames'];
    fieldStyles?: FieldWrapperProps['fieldStyles'];
  };

/** A TreeSelect with a label and hint. Figma: Tree select field. */
export const TreeSelectField = forwardRef<HTMLButtonElement, TreeSelectFieldProps>(function TreeSelectField(
  { label, hint, error, optional, info, required, id, fieldClassName, fieldClassNames, fieldStyles, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <TreeSelect ref={ref} {...(rest as TreeSelectProps)} {...c} />}
    </Field>
  );
});

