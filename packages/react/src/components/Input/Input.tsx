import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { StatusIcon } from '../../internal/StatusIcon';
import { CompactButton } from '../CompactButton';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

/** Parts you can style with `classNames` and `styles`. */
export type InputPart = 'root' | 'icon' | 'prefix' | 'input' | 'suffix' | 'end';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>, PartsProps<InputPart> {
  /** 32, 40 or 48px tall. Figma: Size. */
  size?: InputSize;
  /** Icon at the start, like a search glass. Decorative. Figma: L icon. */
  iconLeft?: ReactNode;
  /** Something at the end: an icon, or a CompactButton for actions like clear or show password. Figma: R icon. */
  iconRight?: ReactNode;
  /** Text or a control before the value, split by a line, like "https://". Figma: Prefix. */
  prefix?: ReactNode;
  /** Text or a control after the value, like "kg". Figma: Suffix. */
  suffix?: ReactNode;
  /** Red border, a warning icon at the end and aria-invalid. Figma: State=Error. */
  invalid?: boolean;
  /** A green check at the end once the value has passed a check, like an available username. Figma: State=Success. */
  valid?: boolean;
}

/** A single-line text box with a fully round shape. Use InputField to add a label and hint. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', iconLeft, iconRight, prefix, suffix, invalid, valid, disabled, className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<InputPart>('input', { classNames, styles: partStyles });
  return (
    <div {...part('root', [styles.box, styles[size], invalid && styles.invalid, disabled && styles.disabled, className])}>
      {iconLeft && <span {...part('icon', styles.icon)}>{iconLeft}</span>}
      {prefix && <span {...part('prefix', [styles.affix, styles.prefix])}>{prefix}</span>}
      <input ref={ref} disabled={disabled} aria-invalid={invalid || rest['aria-invalid'] || undefined} {...rest} {...part('input', styles.input, rest.style)} />
      {suffix && <span {...part('suffix', [styles.affix, styles.suffix])}>{suffix}</span>}
      <StatusIcon invalid={invalid || !!rest['aria-invalid']} valid={valid} disabled={disabled} />
      {iconRight && <span {...part('end', styles.end)}>{iconRight}</span>}
    </div>
  );
});

type FieldBits = Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info' | 'count'>;

export interface InputFieldProps extends InputProps, FieldBits, FieldWrapperProps {}

/** An Input with a Field label above and a hint below. Figma: Input field. */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, hint, error, optional, info, count, required, id, fieldClassName, fieldClassNames, fieldStyles, invalid, valid, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} count={count} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <Input ref={ref} {...rest} {...c} invalid={invalid || c['aria-invalid']} valid={valid} />}
    </Field>
  );
});

export interface PasswordInputProps extends Omit<InputFieldProps, 'type' | 'iconRight'> {}

/** An InputField with a button that shows or hides the password. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
  const [shown, setShown] = useState(false);
  return (
    <InputField
      ref={ref}
      autoComplete="current-password"
      // Dots show it's a password field even before anyone types; pass your own to change it
      placeholder="••••••••"
      {...props}
      type={shown ? 'text' : 'password'}
      iconRight={
        <CompactButton variant="ghost" aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={undefined} onClick={() => setShown((s) => !s)}>
          <Icon name={shown ? 'EyeSlash' : 'Eye'} />
        </CompactButton>
      }
    />
  );
});
