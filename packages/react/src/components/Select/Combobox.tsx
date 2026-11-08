import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { mergeRefs, Portal, useDismiss, useFloating } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { StatusIcon } from '../../internal/StatusIcon';
import { useControllable } from '../../internal/useControllable';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import inputStyles from '../Input/Input.module.css';
import menuStyles from '../Menu/Menu.module.css';
import { Tag } from '../Tag';
import styles from './Select.module.css';
import type { SelectOption } from './Select';

/** Parts you can style with `classNames` and `styles`. The menu opens in a layer over the page. */
export type ComboboxPart = 'root' | 'values' | 'input' | 'caret' | 'menu' | 'option' | 'empty';

export interface ComboboxOption extends SelectOption {
  /** An Avatar, size "xs", for people. Shows in the list and on the option's tag. */
  avatar?: ReactNode;
}

interface ComboboxBase extends PartsProps<ComboboxPart> {
  options: ComboboxOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  /** Lets people add what they typed as a new option. Called with the text. */
  onCreate?: (text: string) => void;
  /** Shown when nothing matches. */
  emptyText?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
  className?: string;
  /** Form field name. Hidden inputs carry the value, one per chosen option. */
  name?: string;
}

export interface ComboboxProps extends ComboboxBase {
  /** One value, or several shown as Tags. Figma: Type. */
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface MultiComboboxProps extends ComboboxBase {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/**
 * Type to search a list, choose one or several options, or add a new one.
 * Use a Select when people just pick from a short known list. Figma: Combobox.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps | MultiComboboxProps>(function Combobox(props, ref) {
  const { options, placeholder = 'Search', size = 'md', invalid, disabled, onCreate, emptyText = 'No matches', id, className, required, name, classNames, styles: partStyles } = props;
  const part = parts<ComboboxPart>('combobox', { classNames, styles: partStyles });
  const listId = useId();
  const multiple = props.multiple === true;
  const [values, setValues] = useControllable<string[]>(
    multiple ? (props as MultiComboboxProps).value : props.value === undefined ? undefined : props.value ? [props.value] : [],
    multiple ? ((props as MultiComboboxProps).defaultValue ?? []) : props.defaultValue ? [props.defaultValue] : [],
    (next) => (multiple ? (props as MultiComboboxProps).onValueChange?.(next) : (props as ComboboxProps).onValueChange?.(next[0] ?? null)),
  );
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const [query, setQuery] = useState(!multiple && values[0] ? labelOf(values[0]) : '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const { floating, style } = useFloating(box, open, { matchWidth: true });
  useDismiss(open, () => setOpen(false), [box, floating]);

  const searching = multiple || !values[0] || query !== labelOf(values[0]);
  const shown = useMemo(
    () => (searching && query ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase())) : options),
    [options, query, searching],
  );
  const canCreate = Boolean(onCreate && query.trim() && !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase()));
  const count = shown.length + (canCreate ? 1 : 0);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (open) floating.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, floating]);

  const pick = (i: number) => {
    if (i === shown.length && canCreate) {
      onCreate?.(query.trim());
      setQuery('');
      return;
    }
    const o = shown[i];
    if (!o || o.disabled) return;
    if (multiple) {
      setValues(values.includes(o.value) ? values.filter((x) => x !== o.value) : [...values, o.value]);
      setQuery('');
    } else {
      setValues([o.value]);
      setQuery(o.label);
      setOpen(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((active + 1) % Math.max(count, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((active - 1 + count) % Math.max(count, 1));
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      pick(active);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Backspace' && multiple && !query && values.length) {
      setValues(values.slice(0, -1));
    }
  };

  return (
    <>
      <div
        ref={box}
        {...part('root', [
          inputStyles.box,
          inputStyles[size],
          styles.combobox,
          multiple && styles.multiple,
          (invalid || props['aria-invalid']) && inputStyles.invalid,
          disabled && inputStyles.disabled,
          className,
        ])}
        onClick={() => input.current?.focus()}
      >
        {!multiple && <Icon name="MagnifyingGlass" className={cx(inputStyles.icon, styles.caret)} />}
        <div {...part('values', styles.values)}>
          {multiple &&
            values.map((v) => (
              <Tag key={v} size={size === 'sm' ? 'sm' : 'md'} avatar={options.find((o) => o.value === v)?.avatar} disabled={disabled} onRemove={() => setValues(values.filter((x) => x !== v))}>
                {labelOf(v)}
              </Tag>
            ))}
          <input
            ref={mergeRefs(ref, input)}
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open && count ? `${listId}-${active}` : undefined}
            aria-label={props['aria-label']}
            aria-describedby={props['aria-describedby']}
            aria-invalid={invalid || props['aria-invalid'] || undefined}
            aria-required={required || undefined}
            {...part('input', styles.comboInput)}
            placeholder={multiple && values.length ? '' : placeholder}
            disabled={disabled}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
          />
        </div>
        <StatusIcon invalid={invalid || !!props['aria-invalid']} disabled={disabled} />
        <Icon name="CaretDown" {...part('caret', [styles.caret, open && styles.caretOpen])} />
      </div>
      {name && (values.length ? values.map((v) => <input key={v} type="hidden" name={name} value={v} />) : <input type="hidden" name={name} value="" />)}
      {open && (
        <Portal>
          <div ref={floating} id={listId} role="listbox" aria-multiselectable={multiple || undefined} {...part('menu', menuStyles.menu, style)}>
            {shown.map((o, i) => {
              const on = values.includes(o.value);
              return (
                <div
                  key={o.value}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={on}
                  aria-disabled={o.disabled || undefined}
                  data-active={i === active}
                  {...part('option', menuStyles.item)}
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => pick(i)}
                >
                  {o.avatar}
                  {o.icon && <span className={menuStyles.icon} aria-hidden="true">{o.icon}</span>}
                  <span className={menuStyles.itemLabel}>{o.label}</span>
                  {on && <Icon name="Check" className={menuStyles.check} />}
                </div>
              );
            })}
            {canCreate && (
              <div
                id={`${listId}-${shown.length}`}
                data-index={shown.length}
                role="option"
                aria-selected={false}
                data-active={active === shown.length}
                {...part('option', menuStyles.item)}
                onPointerEnter={() => setActive(shown.length)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(shown.length)}
              >
                <Icon name="Plus" className={menuStyles.icon} />
                <span className={menuStyles.itemLabel}>Add "{query.trim()}"</span>
              </div>
            )}
            {count === 0 && <div {...part('empty', menuStyles.empty)}>{emptyText}</div>}
          </div>
        </Portal>
      )}
    </>
  );
});

type FieldBits = Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> & Pick<FieldWrapperProps, 'fieldClassName' | 'fieldClassNames' | 'fieldStyles'>;
export type ComboboxFieldProps = (Omit<ComboboxProps, 'aria-describedby' | 'aria-invalid'> | Omit<MultiComboboxProps, 'aria-describedby' | 'aria-invalid'>) & FieldBits;

/** A Combobox with a label and hint. */
export const ComboboxField = forwardRef<HTMLInputElement, ComboboxFieldProps>(function ComboboxField(
  { label, hint, error, optional, info, required, id, fieldClassName, fieldClassNames, fieldStyles, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <Combobox ref={ref} {...(rest as ComboboxProps)} {...c} />}
    </Field>
  );
});
