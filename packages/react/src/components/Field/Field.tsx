import { useEffect, useId } from 'react';
import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { CompactButton } from '../CompactButton';
import { Tooltip } from '../Tooltip';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { useFormContext } from '../Form/context';
import styles from './Field.module.css';

/** Parts of a Field you can style with `classNames` and `styles` (or `fieldClassNames` and `fieldStyles` on the *Field components). */
export type FieldPart = 'root' | 'label' | 'hintRow' | 'hint' | 'count';

/** Styling for the outer field of the *Field components. Their `classNames` and `styles` go to the control. */
export interface FieldWrapperProps {
  /** Class for the outer field, not the control. */
  fieldClassName?: string;
  /** Classes for the field's parts: root, label, hintRow, hint, count. */
  fieldClassNames?: PartsProps<FieldPart>['classNames'];
  /** Styles for the field's parts: root, label, hintRow, hint, count. */
  fieldStyles?: PartsProps<FieldPart>['styles'];
}

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Adds a red asterisk. Figma: Indicator=Required. */
  required?: boolean;
  /** Adds "(Optional)". Use either required or optional across a form, not both. Figma: Indicator=Optional. */
  optional?: boolean;
  /** Extra help shown in a Tooltip from an info button. Figma: Info icon. */
  info?: ReactNode;
  children: ReactNode;
}

/** The label above a form control. Labels have no disabled state; only the control fades. */
export function FieldLabel({ required, optional, info, className, style, children, ...rest }: FieldLabelProps) {
  const { 'data-part': _part, ...labelProps } = rest as typeof rest & { 'data-part'?: string };
  return (
    <span className={cx(styles.labelRow, className)} style={style} data-part="label">
      <label className={styles.label} {...labelProps}>
        {children}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
        {optional && <span className={styles.optional}>(Optional)</span>}
      </label>
      {info && (
        <Tooltip content={info}>
          <CompactButton variant="ghost" size="md" aria-label="More information">
            <Icon name="Info" />
          </CompactButton>
        </Tooltip>
      )}
    </span>
  );
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, PartsProps<FieldPart> {
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  info?: ReactNode;
  /** Help text under the control. Figma: Hint. */
  hint?: ReactNode;
  /** An error message. Replaces the hint, turns red and marks the control invalid. The control shows the warning icon, so the message has none. Figma: State=Error. */
  error?: ReactNode;
  /** Shown at the end of the hint row, like "86 / 2,000". */
  count?: ReactNode;
  /** Render function that receives the ids and state to put on the control. */
  children: (control: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true; required?: boolean }) => ReactNode;
  /** Id for the control. Generated when left out. */
  controlId?: string;
  /** The control's form name. Inside a Form, the field shows the form's error for this name. */
  name?: string;
}

/** Lays out a label, a control and a hint row. Used by the *Field components. */
export function Field({ label, required, optional, info, hint, error: own, count, children, controlId, name, className, classNames, styles: partStyles, ...rest }: FieldProps) {
  const part = parts<FieldPart>('field', { classNames, styles: partStyles });
  const autoId = useId();
  const id = controlId ?? autoId;
  const form = useFormContext();
  const error = own ?? (name && form ? form.errors[name] : undefined);
  const labelText = typeof label === 'string' ? label : (name ?? 'This field');
  useEffect(() => {
    if (!form || !name) return;
    return form.register(name, { label: labelText, required: !!required, id });
  }, [form, name, labelText, required, id]);
  const message = error ?? hint;
  const hintId = message ? `${id}-hint` : undefined;
  return (
    <div {...rest} {...part('root', [styles.field, className], rest.style)}>
      {label && (
        <FieldLabel htmlFor={id} required={required} optional={optional} info={info} {...part('label')}>
          {label}
        </FieldLabel>
      )}
      {children({ id, 'aria-describedby': hintId, 'aria-invalid': error ? true : undefined, required })}
      {(message || count) && (
        <div {...part('hintRow', styles.hintRow)}>
          {message && (
            <span id={hintId} {...part('hint', [styles.hint, error != null && styles.error])}>
              {message}
            </span>
          )}
          {count && <span {...part('count', styles.count)}>{count}</span>}
        </div>
      )}
    </div>
  );
}
