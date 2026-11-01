import { createContext, forwardRef, useContext, useId } from 'react';
import type { FieldsetHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { FieldLabel } from '../Field';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Radio.module.css';

export type RadioSize = 'sm' | 'md';

interface GroupCtx {
  name: string;
  value: string | undefined;
  setValue: (v: string) => void;
  size: RadioSize;
  invalid: boolean;
  disabled: boolean;
}
const RadioGroupContext = createContext<GroupCtx | null>(null);

/** Parts you can style with `classNames` and `styles`. `className` goes on the root; other props go on the input. */
export type RadioPart = 'root' | 'control' | 'input' | 'text' | 'label' | 'description';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, PartsProps<RadioPart> {
  /** What choosing this option means. Figma: Label. */
  label?: ReactNode;
  /** Extra detail under the label. Figma: Description. */
  description?: ReactNode;
  /** 16px (sm) or 20px (md) circle. Set on the group instead when inside one. Figma: Size. */
  size?: RadioSize;
  /** The value sent when this option is chosen. */
  value: string;
  invalid?: boolean;
}

/** One option in a RadioGroup. A single radio on its own can't be unchosen; use a Checkbox for that. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, size, value, invalid, disabled, className, classNames, styles: partStyles, id, onChange, ...rest },
  ref,
) {
  const part = parts<RadioPart>('radio', { classNames, styles: partStyles });
  const g = useContext(RadioGroupContext);
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-description` : undefined;
  const s = size ?? g?.size ?? 'md';
  const isDisabled = disabled ?? g?.disabled;
  const isInvalid = invalid ?? g?.invalid;
  return (
    <label {...part('root', [styles.field, styles[s], isDisabled && styles.disabled, className])} htmlFor={inputId}>
      <span {...part('control', styles.control)}>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type="radio"
          {...part('input', styles.input, rest.style)}
          value={value}
          name={g?.name ?? rest.name}
          checked={g ? g.value === value : rest.checked}
          disabled={isDisabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={descId}
          onChange={(e) => {
            g?.setValue(value);
            onChange?.(e);
          }}
        />
      </span>
      {(label || description) && (
        <span {...part('text', styles.text)}>
          {label && <span {...part('label', styles.label)}>{label}</span>}
          {description && <span id={descId} {...part('description', styles.description)}>{description}</span>}
        </span>
      )}
    </label>
  );
});

/** Parts you can style with `classNames` and `styles`. */
export type RadioGroupPart = 'root' | 'legend' | 'options' | 'hint';

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'>, PartsProps<RadioGroupPart> {
  /** Names the group with a Field label. Figma: Label. */
  label: ReactNode;
  /** Hides the label visually but keeps it for screen readers. */
  hideLabel?: boolean;
  required?: boolean;
  optional?: boolean;
  /** Help under the options. Figma: Hint. */
  hint?: ReactNode;
  /** An error message. Turns every circle red. Figma: State=Error. */
  error?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Stack the options, or put two or three short ones in a row. Figma: Orientation. */
  orientation?: 'vertical' | 'horizontal';
  size?: RadioSize;
  /** Form field name. Generated when left out. */
  name?: string;
  children: ReactNode;
}

/** A labelled set of radios where exactly one can be chosen. Arrow keys move between them. */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { label, hideLabel, required, optional, hint, error, value, defaultValue, onValueChange, orientation = 'vertical', size = 'md', name, disabled = false, className, classNames, styles: partStyles, children, ...rest },
  ref,
) {
  const part = parts<RadioGroupPart>('radio-group', { classNames, styles: partStyles });
  const autoName = useId();
  const [v, setV] = useControllable<string | undefined>(value, defaultValue, onValueChange as (v: string | undefined) => void);
  const hintId = `${autoName}-hint`;
  const legendId = `${autoName}-legend`;
  const message = error ?? hint;
  return (
    // role radiogroup lets the group say it is required; the legend still names it
    <fieldset
      ref={ref}
      role="radiogroup"
      aria-labelledby={legendId}
      disabled={disabled}
      aria-describedby={message ? hintId : undefined}
      aria-required={required || undefined}
      {...rest}
      {...part('root', [styles.group, className], rest.style)}
    >
      <legend id={legendId} {...part('legend', hideLabel ? styles.srOnly : styles.legend)}>
        <FieldLabel required={required} optional={optional}>{label}</FieldLabel>
      </legend>
      <RadioGroupContext.Provider value={{ name: name ?? autoName, value: v, setValue: setV, size, invalid: error != null, disabled }}>
        <div role="radiogroup" {...part('options', [styles.options, styles[orientation], styles[size]])}>{children}</div>
      </RadioGroupContext.Provider>
      {message && (
        <span id={hintId} {...part('hint', [styles.hint, error != null && styles.error])}>
          {error != null && <Icon name="WarningCircle" className={styles.hintIcon} />}
          {message}
        </span>
      )}
    </fieldset>
  );
});
