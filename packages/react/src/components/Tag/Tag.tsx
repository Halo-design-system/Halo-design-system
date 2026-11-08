import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Tag.module.css';

export const TAG_COLORS = ['neutral', 'blue', 'green', 'yellow', 'orange', 'red', 'pink', 'purple'] as const;
export type TagColor = (typeof TAG_COLORS)[number];

/** Parts you can style with `classNames` and `styles`. */
export type TagPart = 'root' | 'avatar' | 'icon' | 'label' | 'remove';

export interface TagProps extends HTMLAttributes<HTMLSpanElement>, PartsProps<TagPart> {
  /**
   * Fill and label colour. One of the preset colours, or any CSS colour (like "#7C3AED") for colours people pick themselves.
   * Custom colours get a light tint and a darker label, and follow dark mode. Figma: Colour.
   */
  color?: TagColor | (string & {});
  /** 24 or 28px tall. Figma: Size. */
  size?: 'sm' | 'md';
  /** Icon before the label. Figma: L icon. */
  icon?: ReactNode;
  /** An Avatar before the label, for people. Use size "xs"; it fits the tag either way. Figma: Avatar. */
  avatar?: ReactNode;
  /** Shows a remove button and calls this when it is pressed. Figma: Closable. */
  onRemove?: () => void;
  /** Screen reader name for the remove button. Defaults to "Remove <label>". */
  removeLabel?: string;
  disabled?: boolean;
  children: ReactNode;
}

/** A small label for a chosen value, a filter or a person. Closable tags can be removed. */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { color = 'neutral', size = 'md', icon, avatar, onRemove, removeLabel, disabled, className, classNames, styles: partStyles, style, children, ...rest },
  ref,
) {
  const part = parts<TagPart>('tag', { classNames, styles: partStyles });
  const preset = (TAG_COLORS as readonly string[]).includes(color);
  const custom = !preset ? ({ '--tag-custom': color } as CSSProperties) : undefined;
  return (
    <span
      ref={ref}
      data-disabled={disabled || undefined}
      {...part('root', [styles.tag, styles[size], color !== 'neutral' && (preset ? styles[color] : styles.custom), disabled && styles.disabled, className], custom ? { ...custom, ...style } : style)}
      {...rest}
    >
      {avatar && <span {...part('avatar', styles.avatar)}>{avatar}</span>}
      {icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>}
      <span {...part('label', styles.label)}>{children}</span>
      {onRemove && (
        <button
          type="button"
          {...part('remove', styles.remove)}
          disabled={disabled}
          aria-label={removeLabel ?? `Remove ${typeof children === 'string' ? children : ''}`.trim()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="X" />
        </button>
      )}
    </span>
  );
});
