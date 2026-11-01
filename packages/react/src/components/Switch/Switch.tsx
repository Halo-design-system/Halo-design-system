import { forwardRef, useId } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useControllable } from '../../internal/useControllable';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Switch.module.css';

/** Parts you can style with `classNames` and `styles`. `className` goes on the root; other props go on the switch button. */
export type SwitchPart = 'root' | 'control' | 'track' | 'thumb' | 'text' | 'label' | 'description';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'>, PartsProps<SwitchPart> {
  /** The setting it turns on or off. Figma: Label. */
  label?: ReactNode;
  /** Extra detail, like why it is disabled. Figma: Description. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** 28 by 16 (sm) or 36 by 20 (md). Figma: Size. */
  size?: 'sm' | 'md';
  /** Switch before the label, or at the end of a full-width row. Figma: Control position. */
  controlPosition?: 'start' | 'end';
}

/** Turns one setting on or off straight away. Use a Checkbox when the choice is sent with a form. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, checked, defaultChecked = false, onCheckedChange, size = 'md', controlPosition = 'start', disabled, id, className, classNames, styles: partStyles, onClick, ...rest },
  ref,
) {
  const part = parts<SwitchPart>('switch', { classNames, styles: partStyles });
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange);
  const autoId = useId();
  const btnId = id ?? autoId;
  const labelId = label ? `${btnId}-label` : undefined;
  const descId = description ? `${btnId}-description` : undefined;
  const control = (
    <button
      ref={ref}
      id={btnId}
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelId}
      aria-describedby={descId}
      disabled={disabled}
      {...part('track', styles.track, rest.style)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) setOn(!on);
      }}
      {...rest}
      style={part('track', undefined, rest.style).style}
    >
      <span {...part('thumb', styles.thumb)} />
    </button>
  );
  if (!label && !description) return <span {...part('root', [styles[size], className])}>{control}</span>;
  return (
    <div data-disabled={disabled || undefined} {...part('root', [styles.field, styles[size], styles[controlPosition], disabled && styles.disabled, className])}>
      <span {...part('control', styles.control)}>{control}</span>
      <span {...part('text', styles.text)}>
        {label && (
          <label id={labelId} htmlFor={btnId} {...part('label', styles.label)}>
            {label}
          </label>
        )}
        {description && <span id={descId} {...part('description', styles.description)}>{description}</span>}
      </span>
    </div>
  );
});
