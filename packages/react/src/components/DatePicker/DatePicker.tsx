import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { mergeRefs, Portal, useDismiss, useFloating } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { StatusIcon } from '../../internal/StatusIcon';
import { useControllable } from '../../internal/useControllable';
import { Button } from '../Button';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import { useWrapped } from '../../internal/useWrapped';
import inputStyles from '../Input/Input.module.css';
import selectStyles from '../Select/Select.module.css';
import { Tag } from '../Tag';
import { Calendar } from './Calendar';
import type { CalendarPreset, DateRange } from './Calendar';
import styles from './DatePicker.module.css';
import { formatDate } from './dates';

/**
 * Parts you can style with `classNames` and `styles`. `start`, `dash` and `end` are in the range box;
 * `values` and `button` in the several-dates box. The popover and calendar open in a layer over the page.
 */
export type DatePickerPart = 'root' | 'icon' | 'value' | 'start' | 'dash' | 'end' | 'values' | 'button' | 'popover' | 'calendar';

interface PickerBase extends PartsProps<DatePickerPart> {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
  /** How the chosen date shows in the box. */
  format?: (date: Date) => string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
  className?: string;
  /** Form field name. A hidden input carries the date as YYYY-MM-DD. */
  name?: string;
}

/** A date as YYYY-MM-DD in local time, for forms. */
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function usePicker() {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement | null>(null);
  const { floating, style } = useFloating(anchor, open, { align: 'start', gap: 4 });
  useDismiss(open, () => setOpen(false), [anchor, floating]);
  // Move focus into the grid when the calendar opens.
  useEffect(() => {
    if (open) floating.current?.querySelector<HTMLElement>('button[tabindex="0"]')?.focus();
  }, [open, floating]);
  const close = () => {
    setOpen(false);
    anchor.current?.focus();
  };
  return { open, setOpen, anchor, floating, style, close };
}

type TriggerProps = PickerBase & {
  open: boolean;
  text?: string;
  /** Range boxes show two slots with a dash between: start and end, each with its own placeholder. */
  range?: { start?: string; end?: string; startPlaceholder: string; endPlaceholder: string };
  onToggle: () => void;
  dialogId: string;
  /** Component name for data-halo. */
  halo: string;
};

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  {
    open,
    text,
    range,
    placeholder,
    size = 'md',
    invalid,
    disabled,
    className,
    onToggle,
    dialogId,
    halo,
    classNames,
    styles: partStyles,
    ...aria
  },
  ref,
) {
  const part = parts<DatePickerPart>(halo, { classNames, styles: partStyles });
  return (
    <button
      ref={ref}
      type="button"
      id={aria.id}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? dialogId : undefined}
      aria-label={aria['aria-label']}
      aria-describedby={aria['aria-describedby']}
      aria-invalid={invalid || aria['aria-invalid'] || undefined}
      aria-required={aria.required || undefined}
      disabled={disabled}
      {...part('root', [inputStyles.box, inputStyles[size], selectStyles.trigger, (invalid || aria['aria-invalid']) && inputStyles.invalid, disabled && inputStyles.disabled, className])}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' && !open) {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <Icon name="CalendarBlank" {...part('icon', [inputStyles.icon, selectStyles.caret])} />
      {range ? (
        <span {...part('value', styles.rangeValue)}>
          <span {...part('start', [styles.rangePart, !range.start && selectStyles.placeholder])}>{range.start ?? range.startPlaceholder}</span>
          <span {...part('dash', styles.rangeDash)} aria-hidden="true">–</span>
          <span {...part('end', [styles.rangePart, !range.end && selectStyles.placeholder])}>{range.end ?? range.endPlaceholder}</span>
        </span>
      ) : (
        <span {...part('value', [selectStyles.value, !text && selectStyles.placeholder])}>{text ?? placeholder}</span>
      )}
      <StatusIcon invalid={invalid || !!aria['aria-invalid']} disabled={disabled} />
    </button>
  );
});

/* ---------- Single date ---------- */

export interface DatePickerProps extends PickerBase {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** Picker (the default) makes the calendar's title a button that jumps to any month and year, for dates far away like a date of birth. Arrows leaves only the arrows. Figma: Header. */
  calendarHeader?: 'arrows' | 'picker';
  /** Years people can jump to with the picker. */
  yearRange?: [number, number];
}

/** A box that opens a Calendar to pick one day. */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  { value, defaultValue = null, onValueChange, placeholder = 'Pick a date', locale, format, min, max, isDateDisabled, weekStartsOn, calendarHeader, yearRange, name, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<DatePickerPart>('date-picker', { classNames, styles: partStyles });
  const dialogId = useId();
  const [date, setDate] = useControllable<Date | null>(value, defaultValue, onValueChange);
  const p = usePicker();
  const show = format ?? ((d: Date) => formatDate(d, locale));
  return (
    <>
      <Trigger ref={mergeRefs(ref, p.anchor)} open={p.open} text={date ? show(date) : undefined} placeholder={placeholder} dialogId={dialogId} onToggle={() => p.setOpen(!p.open)} halo="date-picker" classNames={classNames} styles={partStyles} {...rest} />
      {name && <input type="hidden" name={name} value={date ? isoDate(date) : ''} />}
      {p.open && (
        <Portal>
          <div ref={p.floating} id={dialogId} role="dialog" aria-label="Choose a date" {...part('popover', styles.popover, p.style)}>
            <Calendar
              {...part('calendar')}
              value={date}
              onChange={(d) => {
                setDate(d);
                p.close();
              }}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              locale={locale}
              header={calendarHeader}
              yearRange={yearRange}
            />
          </div>
        </Portal>
      )}
    </>
  );
});

/* ---------- Range ---------- */

export interface DateRangePickerProps extends Omit<PickerBase, 'placeholder'> {
  /** Shown in the first slot before a range is picked. Figma: Start text. */
  startPlaceholder?: string;
  /** Shown in the second slot before a range is picked. Figma: End text. */
  endPlaceholder?: string;
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null) => void;
  /** Quick picks, like "Last 7 days". Figma: Presets. */
  presets?: CalendarPreset[];
}

/** A box that opens a two-month Calendar to pick a start and end day, then Apply. */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker(
  { value, defaultValue = null, onValueChange, startPlaceholder = 'Start date', endPlaceholder = 'End date', locale, format, presets, min, max, isDateDisabled, weekStartsOn, name, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<DatePickerPart>('date-range-picker', { classNames, styles: partStyles });
  const dialogId = useId();
  const [range, setRange] = useControllable<DateRange | null>(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState<DateRange | null>(range);
  const p = usePicker();
  const show = format ?? ((d: Date) => formatDate(d, locale));
  const text = (r: DateRange | null) => (r ? `${show(r[0])} – ${show(r[1])}` : undefined);
  return (
    <>
      <Trigger
        ref={mergeRefs(ref, p.anchor)}
        open={p.open}
        range={{ start: range ? show(range[0]) : undefined, end: range ? show(range[1]) : undefined, startPlaceholder, endPlaceholder }}
        dialogId={dialogId}
        onToggle={() => {
          setDraft(range);
          p.setOpen(!p.open);
        }}
        halo="date-range-picker"
        classNames={classNames}
        styles={partStyles}
        {...rest}
      />
      {name && (
        <>
          <input type="hidden" name={name} value={range ? isoDate(range[0]) : ''} />
          <input type="hidden" name={name} value={range ? isoDate(range[1]) : ''} />
        </>
      )}
      {p.open && (
        <Portal>
          <div ref={p.floating} id={dialogId} role="dialog" aria-label="Choose dates" {...part('popover', styles.popover, p.style)}>
            <Calendar
              {...part('calendar')}
              mode="range"
              value={draft}
              onChange={setDraft}
              presets={presets}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              locale={locale}
              footer={
                <>
                  <span className={styles.rangeText}>{text(draft) ?? 'Pick a start and end day'}</span>
                  <div className={styles.footerActions}>
                    <Button variant="ghost" size="sm" onClick={p.close}>Cancel</Button>
                    <Button
                      size="sm"
                      disabled={!draft}
                      onClick={() => {
                        setRange(draft);
                        p.close();
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        </Portal>
      )}
    </>
  );
});

/* ---------- Several dates ---------- */

export interface MultiDatePickerProps extends PickerBase {
  value?: Date[];
  defaultValue?: Date[];
  onValueChange?: (dates: Date[]) => void;
  /** The most days people can pick. */
  maxCount?: number;
  /** Picker (the default) makes the calendar's title a button that jumps to any month and year. Arrows leaves only the arrows. Figma: Header. */
  calendarHeader?: 'arrows' | 'picker';
  yearRange?: [number, number];
}

/**
 * A box that opens a Calendar to pick several separate days, like days off or delivery days.
 * Each picked day shows as a Tag in the box, with a button to remove it. Figma: Multiple date input.
 */
export const MultiDatePicker = forwardRef<HTMLButtonElement, MultiDatePickerProps>(function MultiDatePicker(
  {
    value,
    defaultValue = [],
    onValueChange,
    placeholder = 'Pick dates',
    locale,
    format,
    min,
    max,
    isDateDisabled,
    weekStartsOn,
    maxCount,
    calendarHeader,
    yearRange,
    size = 'md',
    invalid,
    disabled,
    className,
    name,
    classNames,
    styles: partStyles,
    ...aria
  },
  ref,
) {
  const part = parts<DatePickerPart>('multi-date-picker', { classNames, styles: partStyles });
  const dialogId = useId();
  const [dates, setDates] = useControllable<Date[]>(value, defaultValue, onValueChange);
  const p = usePicker();
  const button = useRef<HTMLButtonElement | null>(null);
  const show = format ?? ((d: Date) => formatDate(d, locale, { day: 'numeric', month: 'short' }));
  const full = (d: Date) => formatDate(d, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const close = () => {
    p.setOpen(false);
    button.current?.focus();
  };
  const remove = (d: Date) => setDates(dates.filter((x) => x.getTime() !== d.getTime()));
  useWrapped(p.anchor as unknown as RefObject<HTMLElement>);
  const isInvalid = invalid || !!aria['aria-invalid'];
  const count = dates.length === 1 ? '1 date' : `${dates.length} dates`;
  return (
    <>
      <div
        ref={p.anchor as unknown as RefObject<HTMLDivElement>}
        {...part('root', [inputStyles.box, inputStyles[size], selectStyles.combobox, selectStyles.multiple, styles.multi, isInvalid && inputStyles.invalid, disabled && inputStyles.disabled, className])}
        onClick={(e) => {
          if (disabled || (e.target as HTMLElement).closest('button')) return;
          p.setOpen(true);
        }}
      >
        <Icon name="CalendarBlank" {...part('icon', [inputStyles.icon, styles.multiIcon])} />
        <div {...part('values', selectStyles.values)}>
          {dates.map((d) => (
            <Tag key={d.getTime()} size={size === 'sm' ? 'sm' : 'md'} disabled={disabled} removeLabel={`Remove ${full(d)}`} onRemove={() => remove(d)}>
              {show(d)}
            </Tag>
          ))}
          <button
            ref={mergeRefs(ref, button)}
            type="button"
            id={aria.id}
            aria-haspopup="dialog"
            aria-expanded={p.open}
            aria-controls={p.open ? dialogId : undefined}
            aria-label={aria['aria-label'] ? `${aria['aria-label']}, ${dates.length ? count : 'none picked'}` : undefined}
            aria-describedby={aria['aria-describedby']}
            aria-invalid={isInvalid || undefined}
            aria-required={aria.required || undefined}
            disabled={disabled}
            {...part('button', [styles.multiButton, !dates.length && selectStyles.placeholder])}
            onClick={() => p.setOpen(!p.open)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' && !p.open) {
                e.preventDefault();
                p.setOpen(true);
              } else if (e.key === 'Backspace' && dates.length) {
                e.preventDefault();
                remove(dates[dates.length - 1]!);
              }
            }}
          >
            {dates.length ? <span className={styles.srOnly}>{placeholder}</span> : placeholder}
          </button>
        </div>
        <StatusIcon invalid={isInvalid} disabled={disabled} />
      </div>
      {name && (dates.length ? dates.map((d) => <input key={d.getTime()} type="hidden" name={name} value={isoDate(d)} />) : <input type="hidden" name={name} value="" />)}
      {p.open && (
        <Portal>
          <div ref={p.floating} id={dialogId} role="dialog" aria-label="Choose dates" {...part('popover', styles.popover, p.style)}>
            <Calendar
              {...part('calendar')}
              mode="multiple"
              value={dates}
              onChange={setDates}
              maxCount={maxCount}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              locale={locale}
              header={calendarHeader}
              yearRange={yearRange}
              footer={
                <>
                  <span className={styles.rangeText} aria-live="polite">
                    {dates.length ? `${count} picked` : 'Pick one or more days'}
                    {maxCount !== undefined && dates.length ? ` of ${maxCount}` : ''}
                  </span>
                  <div className={styles.footerActions}>
                    <Button variant="ghost" size="sm" disabled={!dates.length} onClick={() => setDates([])}>
                      Clear
                    </Button>
                    <Button size="sm" onClick={close}>
                      Done
                    </Button>
                  </div>
                </>
              }
            />
          </div>
        </Portal>
      )}
    </>
  );
});

/* ---------- Fields ---------- */

type FieldBits = Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> & Pick<FieldWrapperProps, 'fieldClassName' | 'fieldClassNames' | 'fieldStyles'>;

export type DatePickerFieldProps = Omit<DatePickerProps, 'aria-describedby' | 'aria-invalid'> & FieldBits;
/** A DatePicker with a label and hint. */
export const DatePickerField = forwardRef<HTMLButtonElement, DatePickerFieldProps>(function DatePickerField(
  { label, hint, error, optional, info, required, id, fieldClassName, fieldClassNames, fieldStyles, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <DatePicker ref={ref} {...rest} {...c} />}
    </Field>
  );
});

export type DateRangePickerFieldProps = Omit<DateRangePickerProps, 'aria-describedby' | 'aria-invalid'> & FieldBits;
/** A DateRangePicker with a label and hint. */
export const DateRangePickerField = forwardRef<HTMLButtonElement, DateRangePickerFieldProps>(function DateRangePickerField(
  { label, hint, error, optional, info, required, id, fieldClassName, fieldClassNames, fieldStyles, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <DateRangePicker ref={ref} {...rest} {...c} />}
    </Field>
  );
});

export type MultiDatePickerFieldProps = Omit<MultiDatePickerProps, 'aria-describedby' | 'aria-invalid'> & FieldBits;
/** A MultiDatePicker with a label and hint. Figma: Multiple date field. */
export const MultiDatePickerField = forwardRef<HTMLButtonElement, MultiDatePickerFieldProps>(function MultiDatePickerField(
  { label, hint, error, optional, info, required, id, fieldClassName, fieldClassNames, fieldStyles, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <MultiDatePicker ref={ref} {...rest} {...c} />}
    </Field>
  );
});
