import { createContext, forwardRef, Fragment, useContext, useMemo, useState } from 'react';
import type { HTMLAttributes, Key, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { useControllable } from '../../internal/useControllable';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { CompactButton } from '../CompactButton';
import { Popover } from '../Popover';
import { Pagination } from '../Pagination';
import { Select } from '../Select';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './Table.module.css';

const SizeCtx = createContext<'md' | 'sm'>('md');

/** Parts you can style with `classNames` and `styles` on Table or DataTable. Rows, cells, the toolbar and the footer pick them up too. */
export type TablePart = 'root' | 'scroll' | 'table' | 'caption' | 'headerCell' | 'row' | 'cell' | 'toolbar' | 'footer' | 'empty' | 'filter' | 'expand' | 'expanded';
const PartCtx = createContext(parts<TablePart>('table', {}));

/* ---------- Building blocks ---------- */

export interface TableProps extends HTMLAttributes<HTMLTableElement>, PartsProps<TablePart> {
  /** Row height: 52 or 40px. Figma: Size. */
  size?: 'md' | 'sm';
  /** Toolbar above the table, like a TableToolbar. */
  toolbar?: ReactNode;
  /** Footer below the table, like a TableFooter. */
  footer?: ReactNode;
  /** Wraps the table in a bordered box with rounded corners. */
  bordered?: boolean;
  /** Visible or screen reader caption. */
  caption?: ReactNode;
  /** Keeps the header row in view while the rows scroll. Pair it with `maxHeight`. */
  stickyHeader?: boolean;
  /** Height after which the rows scroll, like 400 or "60vh". */
  maxHeight?: number | string;
  /** Keeps the first column in view when a wide table scrolls sideways. */
  stickyFirstColumn?: boolean;
}

/** A styled HTML table. Scrolls sideways when it is wider than its container. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { size = 'md', toolbar, footer, bordered = true, caption, stickyHeader, maxHeight, stickyFirstColumn, className, classNames, styles: partStyles, children, ...rest },
  ref,
) {
  const part = useMemo(() => parts<TablePart>('table', { classNames, styles: partStyles }), [classNames, partStyles]);
  return (
    <SizeCtx.Provider value={size}>
      <PartCtx.Provider value={part}>
        <div {...part('root', [styles.frame, bordered && styles.bordered, stickyHeader && styles.stickyHeader, stickyFirstColumn && styles.stickyFirst, className])}>
          {toolbar}
          {/* A scrolling table can be focused, so keyboard users can scroll it with the arrow keys */}
          <div
            tabIndex={maxHeight !== undefined || stickyFirstColumn ? 0 : undefined}
            {...part('scroll', styles.scroll, maxHeight !== undefined ? { maxHeight, overflowY: 'auto' } : undefined)}
          >
            <table ref={ref} {...rest} {...part('table', styles.table, rest.style)}>
              {caption && <caption {...part('caption', styles.caption)}>{caption}</caption>}
              {children}
            </table>
          </div>
          {footer}
        </div>
      </PartCtx.Provider>
    </SizeCtx.Provider>
  );
});

export const TableHead = (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />;
export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />;

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Purple background for a selected row. Figma: State=Selected. */
  selected?: boolean;
}
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ selected, className, ...rest }, ref) {
  const part = useContext(PartCtx);
  return <tr ref={ref} {...rest} {...part('row', [styles.row, selected && styles.selected, className], rest.style)} />;
});

export type SortDirection = 'ascending' | 'descending';

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Numbers line up on the right. Figma: Align. */
  align?: 'left' | 'right';
  /** Makes the header a sort button. Leave undefined for columns that can't be sorted. Figma: Sort. */
  sort?: SortDirection | 'none';
  onSort?: () => void;
  /** A checkbox column. Figma: Type=Checkbox. */
  checkbox?: boolean;
  /** What the filter button opens, like a list of checkboxes. Shows a funnel after the heading. Figma: Filter. */
  filter?: ReactNode;
  /** Marks the funnel when a filter is on. */
  filtered?: boolean;
}

export function TableHeaderCell({ align = 'left', sort, onSort, checkbox, filter, filtered, className, children, ...rest }: TableHeaderCellProps) {
  const sortable = sort !== undefined;
  const icon = sort === 'ascending' ? 'ArrowUp' : sort === 'descending' ? 'ArrowDown' : 'CaretUpDown';
  const part = useContext(PartCtx);
  return (
    <th
      scope="col"
      aria-sort={sortable ? (sort === 'none' ? 'none' : sort) : undefined}
      {...rest}
      {...part('headerCell', [styles.th, align === 'right' && styles.right, checkbox && styles.checkboxCell, className], rest.style)}
    >
      <span className={filter ? styles.headerRow : undefined}>
        {sortable ? (
          <button type="button" className={cx(styles.sort, sort !== 'none' && styles.sorted)} onClick={onSort}>
            {children}
            <Icon name={icon} className={styles.sortIcon} />
          </button>
        ) : (
          children
        )}
        {filter && (
          <Popover
            side="bottom"
            align={align === 'right' ? 'end' : 'start'}
            arrow={false}
            showClose={false}
            trigger={
              <CompactButton {...part('filter', [styles.filterButton, filtered && styles.filtered])} variant="ghost" size="md" selected={filtered} aria-label={filtered ? 'Filter, on' : 'Filter'}>
                <Icon name="Funnel" />
              </CompactButton>
            }
          >
            {filter}
          </Popover>
        )}
      </span>
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Numbers line up on the right with even-width digits. Figma: Type=Number. */
  align?: 'left' | 'right';
  numeric?: boolean;
  /** A grey second line, like an email under a name. Figma: Description. */
  description?: ReactNode;
  /** A checkbox column. Figma: Type=Checkbox. */
  checkbox?: boolean;
}

export function TableCell({ align, numeric, description, checkbox, className, children, ...rest }: TableCellProps) {
  const size = useContext(SizeCtx);
  const part = useContext(PartCtx);
  return (
    <td {...rest} {...part('cell', [styles.td, styles[size], (align === 'right' || numeric) && styles.right, numeric && styles.numeric, checkbox && styles.checkboxCell, className], rest.style)}>
      {description ? (
        <div className={styles.stack}>
          <div>{children}</div>
          <div className={styles.description}>{description}</div>
        </div>
      ) : (
        children
      )}
    </td>
  );
}

/* ---------- Expandable rows ---------- */

export interface TableExpandToggleProps {
  expanded: boolean;
  onToggle: () => void;
  /** Screen reader name, like "Show details for Brand refresh". */
  'aria-label'?: string;
}

/** The arrow button at the start of an expandable row. Put it in a `TableCell checkbox`. */
export function TableExpandToggle({ expanded, onToggle, 'aria-label': label = 'Show details' }: TableExpandToggleProps) {
  const part = useContext(PartCtx);
  return (
    <CompactButton {...part('expand', [styles.expand, expanded && styles.expandOpen])} variant="ghost" size="md" aria-expanded={expanded} aria-label={label} onClick={onToggle}>
      <Icon name="CaretRight" />
    </CompactButton>
  );
}

export interface TableExpandedRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** How many columns the details span. */
  colSpan: number;
}

/** The details under an expanded row. */
export function TableExpandedRow({ colSpan, className, children, ...rest }: TableExpandedRowProps) {
  const part = useContext(PartCtx);
  return (
    <tr {...rest} {...part('expanded', [styles.expandedRow, className], rest.style)}>
      <td colSpan={colSpan} className={styles.expandedCell}>
        {children}
      </td>
    </tr>
  );
}

/* ---------- Toolbar and footer ---------- */

export interface TableToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Search, filters and the main action on the right. */
  actions?: ReactNode;
  /** When above 0, the toolbar switches to the selected state. Figma: State=Selected. */
  selectedCount?: number;
  onClearSelection?: () => void;
  /** Buttons for the selected rows, like Export and Remove. */
  bulkActions?: ReactNode;
}

export function TableToolbar({ title, description, actions, selectedCount = 0, onClearSelection, bulkActions, className, ...rest }: TableToolbarProps) {
  const selecting = selectedCount > 0;
  const part = useContext(PartCtx);
  return (
    <div {...rest} {...part('toolbar', [styles.toolbar, selecting && styles.toolbarSelected, className], rest.style)}>
      {selecting ? (
        <>
          <div className={styles.selection} aria-live="polite">
            <span className={styles.selectedCount}>{selectedCount} selected</span>
            {onClearSelection && <Button variant="ghost" size="sm" onClick={onClearSelection}>Clear</Button>}
          </div>
          {bulkActions && <div className={styles.toolbarActions}>{bulkActions}</div>}
        </>
      ) : (
        <>
          <div className={styles.heading}>
            {title && <div className={styles.title}>{title}</div>}
            {description && <div className={styles.description}>{description}</div>}
          </div>
          {actions && <div className={styles.toolbarActions}>{actions}</div>}
        </>
      )}
    </div>
  );
}

export interface TableFooterProps extends HTMLAttributes<HTMLDivElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Total rows, for the "1 to 10 of 97" count. Figma: Count. */
  total?: number;
  rowsPerPage?: number;
  /** Shows the rows per page picker. Figma: Rows per page. */
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  /** Figma: Pagination. */
  variant?: 'numbers' | 'compact';
}

export function TableFooter({
  page,
  pageCount,
  onPageChange,
  total,
  rowsPerPage = 10,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
  variant = 'numbers',
  className,
  ...rest
}: TableFooterProps) {
  const from = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, total ?? page * rowsPerPage);
  const part = useContext(PartCtx);
  // Keep the current page size in the picker, even when it isn't one of the usual choices
  const sizes = rowsPerPageOptions.includes(rowsPerPage) ? rowsPerPageOptions : [...rowsPerPageOptions, rowsPerPage].sort((x, y) => x - y);
  return (
    <div {...rest} {...part('footer', [styles.footer, className], rest.style)}>
      {onRowsPerPageChange && (
        <div className={styles.footerGroup}>
          <span className={styles.description}>Rows per page</span>
          <Select
            aria-label="Rows per page"
            size="sm"
            className={styles.rowsSelect}
            value={String(rowsPerPage)}
            options={sizes.map((n) => ({ value: String(n), label: String(n) }))}
            onValueChange={(v) => onRowsPerPageChange(Number(v))}
          />
        </div>
      )}
      <div className={cx(styles.footerGroup, styles.footerPages)}>
        {total !== undefined && <span className={styles.description}>{from} to {to} of {total}</span>}
        <Pagination size="sm" variant={variant} page={page} pageCount={Math.max(1, pageCount)} onPageChange={onPageChange} aria-label="Table pages" />
      </div>
    </div>
  );
}

/* ---------- Data table ---------- */

function EmptyCell({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  const part = useContext(PartCtx);
  return (
    <td colSpan={colSpan} {...part('empty', styles.emptyCell)}>
      {children}
    </td>
  );
}

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** What the cell shows. Defaults to row[key]. */
  render?: (row: T) => ReactNode;
  /** Value used for sorting. Defaults to row[key]. Pass to make the column sortable. */
  sortValue?: (row: T) => string | number;
  sortable?: boolean;
  align?: 'left' | 'right';
  numeric?: boolean;
  width?: number | string;
  /** Choices for a filter on this column. Rows show when their value is one of the checked choices. */
  filters?: { value: string; label: string }[];
  /** Custom filter test. Defaults to the cell value matching a checked choice. */
  onFilter?: (row: T, values: string[]) => boolean;
}

export interface DataTableProps<T> extends Omit<TableProps, 'children' | 'footer'> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => Key;
  /** Adds a checkbox column. */
  selectable?: boolean;
  selected?: Key[];
  onSelectedChange?: (ids: Key[]) => void;
  /** Rows per page. Pass 0 to show every row. */
  pageSize?: number;
  /** Shown when there are no rows, like an EmptyState. */
  empty?: ReactNode;
  /** Rows open to show details underneath. `rowExpandable` turns it off for some rows. */
  expandable?: { render: (row: T) => ReactNode; rowExpandable?: (row: T) => boolean };
}

function valueOf<T>(col: DataTableColumn<T>, row: T) {
  return col.sortValue ? col.sortValue(row) : (row as Record<string, unknown>)[col.key];
}

/** A Table with sorting, row selection and paging built in, for data that is already loaded. */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable,
  selected,
  onSelectedChange,
  pageSize: initialPageSize = 10,
  empty,
  expandable,
  ...rest
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDirection } | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [open, setOpen] = useState<Key[]>([]);
  const [chosen, setChosen] = useControllable<Key[]>(selected, [], onSelectedChange);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    const active = columns.filter((c) => filters[c.key]?.length);
    if (!active.length) return rows;
    return rows.filter((row) =>
      active.every((c) => {
        const values = filters[c.key]!;
        return c.onFilter ? c.onFilter(row, values) : values.includes(String((row as Record<string, unknown>)[c.key] ?? ''));
      }),
    );
  }, [rows, columns, filters]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const factor = sort.dir === 'ascending' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const x = valueOf(col, a);
      const y = valueOf(col, b);
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
      return String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true }) * factor;
    });
  }, [filtered, columns, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(page, pageCount);
  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;
  const visibleIds = visible.map(getRowId);
  const allOnPage = visibleIds.length > 0 && visibleIds.every((id) => chosen.includes(id));
  const someOnPage = visibleIds.some((id) => chosen.includes(id));

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: 'ascending' } : s.dir === 'ascending' ? { key, dir: 'descending' } : null));
  const toggleRow = (id: Key) => setChosen(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);
  const togglePage = () => setChosen(allOnPage ? chosen.filter((id) => !visibleIds.includes(id)) : [...new Set([...chosen, ...visibleIds])]);
  const toggleOpen = (id: Key) => setOpen(open.includes(id) ? open.filter((x) => x !== id) : [...open, id]);
  const setFilter = (key: string, values: string[]) => {
    setFilters({ ...filters, [key]: values });
    setPage(1);
  };
  const span = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
  const filterMenu = (col: DataTableColumn<T>) => {
    const on = filters[col.key] ?? [];
    return (
      <div className={styles.filterList}>
        {col.filters!.map((f) => (
          <Checkbox
            key={f.value}
            size="sm"
            label={f.label}
            checked={on.includes(f.value)}
            onCheckedChange={(c) => setFilter(col.key, c ? [...on, f.value] : on.filter((v) => v !== f.value))}
          />
        ))}
        <Button variant="ghost" size="xs" disabled={!on.length} onClick={() => setFilter(col.key, [])}>
          Clear
        </Button>
      </div>
    );
  };

  return (
    <Table
      {...rest}
      footer={
        pageSize > 0 && sorted.length > 0 ? (
          <TableFooter
            page={current}
            pageCount={pageCount}
            onPageChange={setPage}
            total={sorted.length}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        ) : undefined
      }
    >
      <TableHead>
        <tr>
          {expandable && <TableHeaderCell checkbox aria-label="Details" />}
          {selectable && (
            <TableHeaderCell checkbox>
              <Checkbox size="sm" aria-label="Select all rows on this page" checked={allOnPage} indeterminate={someOnPage && !allOnPage} onCheckedChange={togglePage} />
            </TableHeaderCell>
          )}
          {columns.map((col) => (
            <TableHeaderCell
              key={col.key}
              align={col.align ?? (col.numeric ? 'right' : 'left')}
              style={col.width !== undefined ? { width: col.width } : undefined}
              sort={col.sortable || col.sortValue ? (sort?.key === col.key ? sort.dir : 'none') : undefined}
              onSort={() => toggleSort(col.key)}
              filter={col.filters?.length ? filterMenu(col) : undefined}
              filtered={!!filters[col.key]?.length}
            >
              {col.header}
            </TableHeaderCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {visible.length === 0 && (
          <tr>
            <EmptyCell colSpan={span}>{empty ?? 'No rows'}</EmptyCell>
          </tr>
        )}
        {visible.map((row) => {
          const id = getRowId(row);
          const on = chosen.includes(id);
          const canOpen = !!expandable && (expandable.rowExpandable?.(row) ?? true);
          const isOpen = canOpen && open.includes(id);
          return (
            <Fragment key={id}>
            <TableRow selected={selectable ? on : undefined}>
              {expandable && <TableCell checkbox>{canOpen && <TableExpandToggle expanded={isOpen} onToggle={() => toggleOpen(id)} />}</TableCell>}
              {selectable && (
                <TableCell checkbox>
                  <Checkbox size="sm" aria-label="Select row" checked={on} onCheckedChange={() => toggleRow(id)} />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} numeric={col.numeric}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </TableCell>
              ))}
            </TableRow>
            {isOpen && <TableExpandedRow colSpan={span}>{expandable!.render(row)}</TableExpandedRow>}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
