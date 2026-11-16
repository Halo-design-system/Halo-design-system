import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useModal } from '../../internal/dialog';
import { Portal } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { CompactButton } from '../CompactButton';
import { Overlay } from '../Overlay';
import styles from './Modal.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type ModalPart = 'overlay' | 'root' | 'header' | 'icon' | 'title' | 'close' | 'description' | 'content' | 'actions';

export interface ModalProps extends PartsProps<ModalPart> {
  open: boolean;
  /** Called on Escape, the close button, or a click on the overlay. */
  onClose: () => void;
  /** Figma: Title. */
  title: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** destructive uses a red icon. Pair it with a destructive Button. Figma: Type. */
  type?: 'default' | 'destructive';
  /** Replaces the icon in the circle, or false to hide it. Figma: Icon. */
  icon?: ReactNode | false;
  /** horizontal puts the buttons in a row on the right; stacked makes them full width. Figma: Layout. */
  layout?: 'horizontal' | 'stacked';
  /** Figma: Show close. */
  showClose?: boolean;
  /** Buttons. Put the main action last in a row, first when stacked. Figma: Actions. */
  actions?: ReactNode;
  /** Closes when the overlay is clicked. Turn off when closing would lose work. */
  closeOnOverlayClick?: boolean;
  /** Overlay style. */
  overlay?: 'dim' | 'blur';
  /** Extra content between the text and the buttons, like a form. Figma: Content slot. */
  children?: ReactNode;
  className?: string;
}

/**
 * A dialog that blocks the page until people respond. Focus moves in and stays inside,
 * Escape closes it, and focus goes back to the button that opened it.
 * Add `data-autofocus` to the element that should get focus first.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  type = 'default',
  icon,
  layout = 'horizontal',
  showClose = true,
  actions,
  closeOnOverlayClick = true,
  overlay = 'blur',
  children,
  className,
  classNames,
  styles: partStyles,
}: ModalProps) {
  const part = parts<ModalPart>('modal', { classNames, styles: partStyles });
  const id = useId();
  const panel = useRef<HTMLDivElement | null>(null);
  useModal(open, panel, onClose);
  if (!open) return null;

  const shownIcon = icon === false ? null : icon ?? <Icon name={type === 'destructive' ? 'Warning' : 'Info'} />;
  return (
    <Portal>
      <Overlay
        {...part('overlay')}
        variant={overlay}
        onPointerDown={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={panel}
          role={type === 'destructive' ? 'alertdialog' : 'dialog'}
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-desc` : undefined}
          tabIndex={-1}
          {...part('root', [styles.modal, styles[type], styles[layout], className])}
        >
          <div {...part('header', styles.header)}>
            {shownIcon && <span {...part('icon', styles.icon)} aria-hidden="true">{shownIcon}</span>}
            <h2 id={`${id}-title`} {...part('title', styles.title)}>{title}</h2>
            {showClose && (
              <CompactButton variant="ghost" aria-label="Close" {...part('close', styles.close)} onClick={onClose}>
                <Icon name="X" />
              </CompactButton>
            )}
          </div>
          {description && <p id={`${id}-desc`} {...part('description', styles.description)}>{description}</p>}
          {children && <div {...part('content', styles.content)}>{children}</div>}
          {actions && <div {...part('actions', styles.actions)}>{actions}</div>}
        </div>
      </Overlay>
    </Portal>
  );
}
