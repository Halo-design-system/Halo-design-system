import { forwardRef, useEffect, useId, useRef } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md';

/** Parts you can style with `classNames` and `styles`. `className` goes on the root; other props go on the input. */
export type CheckboxPart = 'root' | 'control' | 'input' | 'mark' | 'text' | 'label' | 'description';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, PartsProps<CheckboxPart> {
  /** What ticking the box means. Leave it out only when the box is labelled some other way. Figma: Label. */
  label?: ReactNode;
  /** Extra detail under the label. Figma: Description. */
  description?: ReactNode;
  /** 16px (sm) or 20px (md) box. Figma: Size. */
  size?: CheckboxSize;
  /** Shows a dash for "some, not all" options chosen. Read as "mixed". Figma: Checked=Indeterminate. */
  indeterminate?: boolean;
  /** Shows the error look and tells screen readers the value is invalid. Figma: State=Error. */
  invalid?: boolean;
  /** Called with true or false when the box is ticked or unticked. */
  onCheckedChange?: (checked: boolean) => void;
}

const MARKS: Record<CheckboxSize, { box: number; check: string; dash: string }> = {
  sm: { box: 16, check: 'M3.5 8.25L6.5 11.25L12.5 5', dash: 'M4 8L12 8' },
  md: { box: 20, check: 'M4.5 10.25L8.25 14L15.5 6.5', dash: 'M5 10L15 10' },
};

/** A box people tick to choose any number of options, or to agree to something. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, size = 'md', indeterminate = false, invalid = false, onCheckedChange, onChange, className, classNames, styles: partStyles, id, disabled, ...rest },
  ref,
) {
  const part = parts<CheckboxPart>('checkbox', { classNames, styles: partStyles });
  const inner = useRef<HTMLInputElement | null>(null);
  const autoId = useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-description` : undefined;
  const m = MARKS[size];

  // indeterminate can only be set from script, not as an attribute.
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const setRef = (node: HTMLInputElement | null) => {
    inner.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label
      data-disabled={disabled || undefined}
      {...part('root', [styles.field, styles[size], disabled && styles.disabled, className])}
      htmlFor={inputId}
    >
      <span {...part('control', styles.control)}>
        <input
          {...rest}
          ref={setRef}
          id={inputId}
          type="checkbox"
          {...part('input', styles.input, rest.style)}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={[rest['aria-describedby'], descId].filter(Boolean).join(' ') || undefined}
          onChange={handleChange}
        />
        <svg {...part('mark', styles.mark)} viewBox={`0 0 ${m.box} ${m.box}`} aria-hidden="true">
          <path className={styles.check} d={m.check} />
          <path className={styles.dash} d={m.dash} />
        </svg>
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
