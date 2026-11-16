import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useModal } from '../../internal/dialog';
import { Portal } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { CompactButton } from '../CompactButton';
import { Overlay } from '../Overlay';
import styles from './Drawer.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type DrawerPart = 'overlay' | 'root' | 'handle' | 'header' | 'title' | 'description' | 'close' | 'content' | 'footer';

export interface DrawerProps extends PartsProps<DrawerPart> {
  open: boolean;
  /** Called on Escape, the close button, or a click on the overlay. */
  onClose: () => void;
  /** Figma: Title. */
  title: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** Which edge it slides in from. Bottom suits phones. Figma: Side. */
  side?: 'right' | 'left' | 'bottom';
  /** Width for side drawers: 320, 400 or 560px. Figma: Size. */
  size?: 'sm' | 'md' | 'lg';
  /** Figma: Show close. */
  showClose?: boolean;
  /** Buttons in the footer. Figma: Actions. */
  actions?: ReactNode;
  closeOnOverlayClick?: boolean;
  overlay?: 'dim' | 'blur';
  /** The body, which scrolls when it is long. Figma: Content slot. */
  children?: ReactNode;
  className?: string;
}

/**
 * A panel that slides in from an edge for details, filters or a form, keeping the page in view.
 * Behaves like a Modal: focus stays inside and Escape closes it.
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  size = 'md',
  showClose = true,
  actions,
  closeOnOverlayClick = true,
  overlay = 'blur',
  children,
  className,
  classNames,
  styles: partStyles,
}: DrawerProps) {
  const part = parts<DrawerPart>('drawer', { classNames, styles: partStyles });
  const id = useId();
  const panel = useRef<HTMLDivElement | null>(null);
  useModal(open, panel, onClose);
  if (!open) return null;

  return (
    <Portal>
      <Overlay
        {...part('overlay')}
        variant={overlay}
        position={side}
        onPointerDown={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-desc` : undefined}
          tabIndex={-1}
          {...part('root', [styles.drawer, styles[side], side !== 'bottom' && styles[size], className])}
        >
          {side === 'bottom' && (
            <div {...part('handle', styles.handle)} aria-hidden="true">
              <span className={styles.grip} />
            </div>
          )}
          <div {...part('header', styles.header)}>
            <div className={styles.text}>
              <h2 id={`${id}-title`} {...part('title', styles.title)}>{title}</h2>
              {description && <p id={`${id}-desc`} {...part('description', styles.description)}>{description}</p>}
            </div>
            {showClose && (
              <CompactButton variant="ghost" aria-label="Close" {...part('close')} onClick={onClose}>
                <Icon name="X" />
              </CompactButton>
            )}
          </div>
          <div {...part('content', styles.content)}>{children}</div>
          {actions && <div {...part('footer', styles.footer)}>{actions}</div>}
        </div>
      </Overlay>
    </Portal>
  );
}
