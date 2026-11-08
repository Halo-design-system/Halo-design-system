import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './CompactButton.module.css';

export type CompactButtonVariant = 'stroke' | 'ghost' | 'fill';
export type CompactButtonSize = 'md' | 'lg';

/** Parts you can style with `classNames` and `styles`. */
export type CompactButtonPart = 'root' | 'icon';

export interface CompactButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PartsProps<CompactButtonPart> {
  /** Background and outline. Figma: Style. */
  variant?: CompactButtonVariant;
  /** lg is 28px with a 20px icon, md is 24px with a 16px icon. Figma: Size. */
  size?: CompactButtonSize;
  /** Fully round corners instead of slightly rounded. Figma: Full radius. */
  round?: boolean;
  /** Switched on, for buttons that toggle (like Bold). Sets aria-pressed. Figma: State=Selected. */
  selected?: boolean;
  /** The icon. Figma: Change icon. */
  children: ReactNode;
  /** Compact buttons have no visible text, so they need a name for screen readers. */
  'aria-label': string;
}

export const CompactButton = forwardRef<HTMLButtonElement, CompactButtonProps>(function CompactButton(
  { variant = 'stroke', size = 'lg', round = false, selected, children, className, classNames, styles: partStyles, style, type = 'button', ...rest },
  ref,
) {
  const part = parts<CompactButtonPart>('compact-button', { classNames, styles: partStyles });

  return (
    <button ref={ref} type={type} {...part('root', [styles.button, styles[variant], styles[size], round && styles.round, selected && styles.selected, className], style)} aria-pressed={selected} {...rest}>
      <span {...part('icon', styles.icon)} aria-hidden="true">{children}</span>
    </button>
  );
});
