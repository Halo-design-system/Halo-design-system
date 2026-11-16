import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import styles from './Overlay.module.css';

export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** blur darkens and softly blurs the page; dim only darkens it. Figma: Style. */
  variant?: 'dim' | 'blur';
  /** Where the content sits. Figma: Position. */
  position?: 'center' | 'left' | 'right' | 'bottom';
}

/** Covers the page behind a Modal or Drawer. Fixed to the viewport. */
export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(function Overlay(
  { variant = 'blur', position = 'center', className, ...rest },
  ref,
) {
  return <div ref={ref} data-halo="overlay" className={cx(styles.overlay, styles[variant], styles[position], className)} {...rest} />;
});
