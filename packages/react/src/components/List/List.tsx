import { Children, createContext, forwardRef, isValidElement, useContext } from 'react';
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './List.module.css';

const SizeCtx = createContext<'md' | 'sm'>('md');
// Whether rows get side padding, for lists people hover or select (see `inset`)
const InsetCtx = createContext(false);

/** Parts you can style with `classNames` and `styles`. */
// 'divider' is kept so existing classNames still type-check; divided lists now draw their lines with borders
export type ListPart = 'root' | 'divider';

export interface ListProps extends HTMLAttributes<HTMLUListElement>, PartsProps<ListPart> {
  /** plain, divided (lines between items) or card (a bordered box). Figma: Style. */
  variant?: 'plain' | 'divided' | 'card';
  /** Figma: Size. */
  size?: 'md' | 'sm';
  /**
   * For lists whose rows can be hovered or selected, like conversations and pickers: every row gets 8px side padding,
   * so the highlight doesn't touch the avatar or icon. Without it, rows have no side padding and line up with the
   * content around the list; the card style gives its own inset. Figma: 8px side padding on the List item.
   */
  inset?: boolean;
}

/** A vertical list of ListItems, like files, settings or people. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List({ variant = 'plain', size = 'md', inset = false, className, classNames, styles: partStyles, children, ...rest }, ref) {
  const part = parts<ListPart>('list', { classNames, styles: partStyles });
  const items = Children.toArray(children).filter(isValidElement);
  return (
    <SizeCtx.Provider value={size}>
      <InsetCtx.Provider value={inset}>
        <ul ref={ref} {...rest} {...part('root', [styles.list, styles[variant], inset && styles.insetList, className], rest.style)}>
          {/* Divided lists draw their lines with borders, so the list holds only list items */}
          {items}
        </ul>
      </InsetCtx.Provider>
    </SizeCtx.Provider>
  );
});

/** Parts you can style with `classNames` and `styles`. */
export type ListItemPart = 'root' | 'row' | 'icon' | 'slot' | 'text' | 'title' | 'description';

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title' | 'onClick'>, PartsProps<ListItemPart> {
  /** Figma: Title. */
  title: ReactNode;
  /** Figma: Description. */
  description?: ReactNode;
  /** Icon before the text. Figma: L icon. */
  icon?: ReactNode;
  /** Anything before the text instead of an icon, like an Avatar or Checkbox. Figma: L slot. */
  leading?: ReactNode;
  /** Anything after the text, like a Badge, Switch or value. Figma: R slot. */
  trailing?: ReactNode;
  /** Icon at the end, like a caret for items that open something. Figma: R icon. */
  trailingIcon?: ReactNode;
  /** Makes the row a link. */
  href?: string;
  /** Makes the row a button. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Purple background for the chosen row. Figma: State=Selected. */
  selected?: boolean;
  disabled?: boolean;
  /** 8px side padding for a row people hover or select. Defaults to the List's `inset`. */
  inset?: boolean;
}

/** One row of a List. Pass `href` or `onClick` to make the whole row clickable. */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { title, description, icon, leading, trailing, trailingIcon, href, onClick, selected, disabled, inset: insetProp, className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<ListItemPart>('list-item', { classNames, styles: partStyles });
  const size = useContext(SizeCtx);
  const listInset = useContext(InsetCtx);
  const inset = insetProp ?? listInset;
  const inner = (
    <>
      {icon && <span {...part('icon', styles.icon)} aria-hidden="true">{icon}</span>}
      {leading && <span {...part('slot', styles.slot)}>{leading}</span>}
      <span {...part('text', styles.text)}>
        <span {...part('title', styles.title)}>{title}</span>
        {description && <span {...part('description', styles.description)}>{description}</span>}
      </span>
      {trailing && <span {...part('slot', styles.slot)}>{trailing}</span>}
      {trailingIcon && <span {...part('icon', [styles.icon, styles.trailingIcon])} aria-hidden="true">{trailingIcon}</span>}
    </>
  );
  const rowClass = cx(styles.row, styles[size], inset && styles.inset, selected && styles.selected, disabled && styles.disabled);
  return (
    <li ref={ref} {...rest} {...part('root', [styles.item, className], rest.style)}>
      {href && !disabled ? (
        <a href={href} {...part('row', [rowClass, styles.interactive])} aria-current={selected ? 'page' : undefined} onClick={onClick}>
          {inner}
        </a>
      ) : onClick || href ? (
        <button type="button" {...part('row', [rowClass, styles.interactive])} aria-pressed={selected} disabled={disabled} onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div {...part('row', rowClass)}>{inner}</div>
      )}
    </li>
  );
});
