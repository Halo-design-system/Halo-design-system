import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Icon } from '../../internal/Icon';
import { Portal, useDismiss, useFloating } from '../../internal/floating';
import { MonthYearPanel } from '../../internal/MonthYearPanel';
import { useControllable } from '../../internal/useControllable';
import { CompactButton } from '../CompactButton';
import { Calendar } from '../DatePicker/Calendar';
import { addDays, addMonths, before, formatDate, monthGrid, sameDay, sameMonth, startOfDay } from '../DatePicker/dates';
import { Popover } from '../Popover';
import { SegmentedControl } from '../SegmentedControl';
import { TAG_COLORS } from '../Tag';
import type { TagColor } from '../Tag';
import styles from './EventCalendar.module.css';

export interface CalendarEvent {
  id: string;
  title: string;
  /** When it starts. Give a time for events at set hours, like 09:30. */
  start: Date;
  /**
   * When it ends. For timed events, the end time on the same day. For events over several days,
   * the last day. Leave out for a one-day event.
   */
  end?: Date;
  /** Shows in the all-day row of the week and day views, even with a time. */
  allDay?: boolean;
  /** A preset colour like "blue", or any CSS colour. Defaults to neutral. Uses the Tag colours. */
  color?: TagColor | (string & {});
  /** A small Avatar or image before the title, like the patient or the person you are meeting. Figma: Avatar. */
  avatar?: ReactNode;
  /** A second line under the title in the day and week views, like the reason for an appointment. Shown instead of the time. */
  detail?: ReactNode;
}

export type EventCalendarView = 'day' | 'week' | 'month' | 'year';

/** Parts you can style with `classNames` and `styles`. */
export type EventCalendarPart =
  | 'root' | 'header' | 'nav' | 'title' | 'controls' | 'viewSwitch' | 'jumpPanel'
  | 'month' | 'weekday' | 'week' | 'day' | 'date' | 'event' | 'more' | 'extra' | 'agenda'
  | 'year' | 'monthCell'
  | 'timeGrid' | 'dayHeader' | 'allDay' | 'hours' | 'column' | 'now';

export interface EventCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, PartsProps<EventCalendarPart> {
  events?: CalendarEvent[];
  /** The selected day. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Any day in the month on show. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Day and Week show hours with timed events; Month shows days; Year shows months. Figma: View. */
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /** Which views the switch offers. */
  views?: EventCalendarView[];
  /**
   * Full: the title can be clicked to open a calendar and jump to any date, and the view switch shows.
   * Simple: a plain title with the arrows. Figma: Header.
   */
  header?: 'full' | 'simple';
  /** Years people can jump to from the title. Defaults to ten years either side of today. */
  yearRange?: [number, number];
  /** Event rows shown in a day before "+2 more". */
  maxEvents?: number;
  /** The hour the day and week views scroll to first. */
  startHour?: number;
  /** Height of one hour in the day and week views, in px. */
  hourHeight?: number;
  /** 0 for Sunday, 1 for Monday. */
  weekStartsOn?: 0 | 1;
  /** For month, weekday and time formats. Defaults to the browser's language. */
  locale?: string;
  /** Extra content inside a day of the month view, under its events, like a price or a status. */
  renderDay?: (date: Date, events: CalendarEvent[]) => ReactNode;
  /** Extra content inside a month in the year view. */
  renderMonth?: (month: Date, events: CalendarEvent[]) => ReactNode;
  onEventClick?: (event: CalendarEvent) => void;
  /** Called with the time when people click an empty slot in the day or week view, rounded to 30 minutes. Use it to add an event there. */
  onSlotClick?: (date: Date) => void;
}

const DAY = 86400000;
const dayIndex = (d: Date, from: Date) => Math.round((startOfDay(d).getTime() - from.getTime()) / DAY);
const minutes = (d: Date) => d.getHours() * 60 + d.getMinutes();
const lastDay = (e: CalendarEvent) => (e.end && before(e.start, e.end) ? e.end : e.start);
const onDay = (e: CalendarEvent, d: Date) => !before(d, e.start) && !before(lastDay(e), d);
/** Events at set hours on one day. Everything else is a day event. */
const isTimed = (e: CalendarEvent) =>
  !e.allDay && (!e.end || sameDay(e.start, e.end)) && (minutes(e.start) > 0 || (!!e.end && minutes(e.end) > 0));

function colourProps(color: CalendarEvent['color']): { className?: string; style?: CSSProperties } {
  if (!color || color === 'neutral') return { className: styles.neutral };
  if ((TAG_COLORS as readonly string[]).includes(color)) return { className: styles[color] };
  return { className: styles.custom, style: { '--event-custom': color } as CSSProperties };
}

/** Lays out day events across a run of days in rows, so events that overlap sit on different rows. */
function layoutRows(events: CalendarEvent[], first: Date, count: number) {
  const last = addDays(first, count - 1);
  const items = events
    .filter((e) => !before(lastDay(e), first) && !before(last, e.start))
    .map((e) => ({ event: e, from: Math.max(0, dayIndex(e.start, first)), to: Math.min(count - 1, dayIndex(lastDay(e), first)) }))
    .sort((a, b) => a.from - b.from || b.to - b.from - (a.to - a.from));
  const rows: boolean[][] = [];
  return items.map((item) => {
    let row = 0;
    while (rows[row]?.slice(item.from, item.to + 1).some(Boolean)) row++;
    rows[row] ??= new Array(count).fill(false);
    for (let i = item.from; i <= item.to; i++) rows[row]![i] = true;
    return { ...item, row };
  });
}

/** Places timed events in a day side by side when they overlap. */
function layoutTimed(events: CalendarEvent[]) {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime() || endMin(b) - endMin(a));
  const placed: { event: CalendarEvent; col: number; cols: number }[] = [];
  let group: typeof placed = [];
  let colEnds: number[] = [];
  let groupEnd = -1;
  const close = () => {
    for (const p of group) p.cols = colEnds.length;
    group = [];
    colEnds = [];
  };
  for (const e of sorted) {
    const s = minutes(e.start);
    if (s >= groupEnd) close();
    let col = colEnds.findIndex((end) => end <= s);
    if (col < 0) col = colEnds.push(0) - 1;
    colEnds[col] = endMin(e);
    groupEnd = Math.max(groupEnd, endMin(e));
    const p = { event: e, col, cols: 1 };
    group.push(p);
    placed.push(p);
  }
  close();
  return placed;
}
function endMin(e: CalendarEvent) {
  const s = minutes(e.start);
  return e.end && sameDay(e.start, e.end) ? Math.max(minutes(e.end), s + 15) : s + 60;
}

/**
 * A full-size calendar for planning. Day and Week show hours with timed events, an all-day row
 * and a line at the current time. Month shows days with events, and events over several days run
 * as one bar. Year shows the twelve months. On narrow screens, the month shows dots and lists the
 * chosen day's events underneath. Figma: Event calendar.
 */
export function EventCalendar({
  events = [],
  value,
  defaultValue = null,
  onValueChange,
  month,
  defaultMonth,
  onMonthChange,
  view,
  defaultView = 'month',
  onViewChange,
  views = ['day', 'week', 'month', 'year'],
  header = 'full',
  yearRange,
  maxEvents = 3,
  startHour = 8,
  hourHeight = 48,
  weekStartsOn = 1,
  locale,
  renderDay,
  renderMonth,
  onEventClick,
  onSlotClick,
  className,
  classNames,
  styles: partStyles,
  ...rest
}: EventCalendarProps) {
  const part = parts<EventCalendarPart>('event-calendar', { classNames, styles: partStyles });
  const today = startOfDay(new Date());
  const [selected, setSelected] = useControllable<Date | null>(value, defaultValue, (d) => d && onValueChange?.(d));
  const [shown, setShown] = useControllable<Date>(month, startOfDay(defaultMonth ?? defaultValue ?? today), onMonthChange);
  const [mode, setMode] = useControllable<EventCalendarView>(view, defaultView, onViewChange);
  // The day the day and week views are on, and the day with keyboard focus in the month.
  const [focus, setFocus] = useState(() => startOfDay(selected ?? defaultMonth ?? today));
  const grid = useRef<HTMLDivElement | null>(null);
  const moved = useRef(false);
  // The month and year picker that opens from the title.
  const [jumping, setJumping] = useState(false);
  const jumpAnchor = useRef<HTMLButtonElement | null>(null);
  const { floating: jumpPanel, style: jumpStyle } = useFloating(jumpAnchor, jumping, { align: 'start', gap: 6 });
  const closeJump = () => {
    setJumping(false);
    jumpAnchor.current?.focus();
  };
  useDismiss(jumping, closeJump, [jumpAnchor, jumpPanel]);

  const first = new Date(shown.getFullYear(), shown.getMonth(), 1);
  const weeks = useMemo(() => {
    const all = monthGrid(first, weekStartsOn);
    // Drop a sixth week that is all next month.
    return all.filter((w, i) => i < 5 || sameMonth(w[0]!, first));
  }, [first.getTime(), weekStartsOn]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fromYear, toYear] = yearRange ?? [today.getFullYear() - 10, today.getFullYear() + 10];
  const monthNames = Array.from({ length: 12 }, (_, m) => formatDate(new Date(2024, m, 1), locale, { month: 'short' }));
  const weekdays = weeks[0]!.map((d) => ({ short: formatDate(d, locale, { weekday: 'short' }), long: formatDate(d, locale, { weekday: 'long' }) }));
  const time = (d: Date) => formatDate(d, locale, { hour: '2-digit', minute: '2-digit' });

  // Keep the month and the day in step.
  const goDay = (d: Date) => {
    setFocus(startOfDay(d));
    if (!sameMonth(d, first)) setShown(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const goMonth = (y: number, m: number) => {
    const last = new Date(y, m + 1, 0).getDate();
    setShown(new Date(y, m, 1));
    setFocus(new Date(y, m, Math.min(focus.getDate(), last)));
  };
  const step = (n: number) => {
    if (mode === 'day') goDay(addDays(focus, n));
    else if (mode === 'week') goDay(addDays(focus, n * 7));
    else if (mode === 'year') goMonth(first.getFullYear() + n, first.getMonth());
    else goMonth(addMonths(first, n).getFullYear(), addMonths(first, n).getMonth());
  };
  const choose = (d: Date) => {
    setSelected(d);
    goDay(d);
  };

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus.toDateString()}"]`)?.focus();
  }, [focus, shown]);

  const onKey = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in moves) || !(e.target as HTMLElement).dataset.day) return;
    e.preventDefault();
    moved.current = true;
    goDay(addDays(focus, moves[e.key]!));
  };

  const weekStart = addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7));
  const days = mode === 'day' ? [focus] : Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const title =
    mode === 'year'
      ? String(first.getFullYear())
      : mode === 'month'
        ? formatDate(first, locale, { month: 'long', year: 'numeric' })
        : mode === 'day'
          ? formatDate(focus, locale, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
          : weekTitle(days[0]!, days[6]!, locale);
  const navLabel = { day: 'day', week: 'week', month: 'month', year: 'year' }[mode];
  const tabbable = sameMonth(focus, first) ? focus : first;
  const agendaDay = selected ?? (sameMonth(today, first) ? today : first);
  const agenda = events.filter((e) => onDay(e, agendaDay));
  const span = (e: CalendarEvent) =>
    isTimed(e)
      ? `${formatDate(e.start, locale, { weekday: 'long', day: 'numeric', month: 'long' })}, ${time(e.start)}${e.end ? ` to ${time(e.end)}` : ''}`
      : e.end && !sameDay(e.start, e.end)
        ? `${formatDate(e.start, locale, { day: 'numeric', month: 'short' })} to ${formatDate(lastDay(e), locale, { day: 'numeric', month: 'short' })}`
        : formatDate(e.start, locale, { weekday: 'long', day: 'numeric', month: 'long' });

  const eventButton = (e: CalendarEvent, extra?: string, style?: CSSProperties, children?: ReactNode) => {
    const c = colourProps(e.color);
    return (
      <button
        key={e.id}
        type="button"
        {...part('event', [styles.event, c.className, extra], { ...c.style, ...style })}
        onClick={() => onEventClick?.(e)}
      >
        {children ?? (
          <>
            {e.avatar && <span className={styles.eventAvatar} aria-hidden="true">{e.avatar}</span>}
            <span className={styles.eventTitle}>
              {isTimed(e) && <span className={styles.eventTime}>{time(e.start)} </span>}
              {e.title}
            </span>
          </>
        )}
        {/* The name is what the button shows, then the day and time for screen readers, so voice control users can say what they see */}
        <span className={styles.srOnly}>, {span(e)}</span>
      </button>
    );
  };

  const viewNames: Record<EventCalendarView, string> = { day: 'Day', week: 'Week', month: 'Month', year: 'Year' };

  return (
    <div {...rest} {...part('root', [styles.root, className], rest.style)}>
      <div {...part('header', styles.header)}>
        <div className={styles.lead}>
          {/* The arrows sit either side of the period they move, so it is clear what they change. */}
          <span {...part('nav', styles.nav)}>
            <CompactButton variant="ghost" aria-label={`Previous ${navLabel}`} title={`Previous ${navLabel}`} onClick={() => step(-1)}>
              <Icon name="CaretLeft" />
            </CompactButton>
            {header === 'full' ? (
              <h2 {...part('title', [styles.title, styles[`title-${mode}`]])}>
                <button
                  ref={jumpAnchor}
                  type="button"
                  className={styles.titleButton}
                  aria-haspopup="dialog"
                  aria-expanded={jumping}
                  aria-label={`${title}, choose ${mode === 'year' ? 'a year' : 'a date'}`}
                  onClick={() => setJumping(!jumping)}
                >
                  <span aria-live="polite">{title}</span>
                </button>
              </h2>
            ) : (
              <h2 {...part('title', [styles.title, styles[`title-${mode}`]])} aria-live="polite">{title}</h2>
            )}
            <CompactButton variant="ghost" aria-label={`Next ${navLabel}`} title={`Next ${navLabel}`} onClick={() => step(1)}>
              <Icon name="CaretRight" />
            </CompactButton>
          </span>
        </div>
        {header === 'full' && views.length > 1 && (
          <div {...part('controls', styles.controls)}>
            {(
              <SegmentedControl
                {...part('viewSwitch', styles.viewSwitch)}
                aria-label="View"
                size="sm"
                value={mode}
                onValueChange={(v) => setMode(v as EventCalendarView)}
                options={views.map((v) => ({ value: v, label: viewNames[v] }))}
              />
            )}
          </div>
        )}
      </div>

      {jumping && (
        <Portal>
          <div ref={jumpPanel} role="dialog" aria-label={mode === 'year' ? 'Choose a year' : 'Choose a date'} {...part('jumpPanel', styles.jumpPanel, jumpStyle)}>
            {mode === 'year' ? (
              <MonthYearPanel
                className={styles.yearJump}
                value={first}
                unit="year"
                fromYear={fromYear}
                toYear={toYear}
                locale={locale}
                onSelect={(d) => {
                  goMonth(d.getFullYear(), first.getMonth());
                  closeJump();
                }}
              />
            ) : (
              // A calendar to pick any day; its own month name jumps to other months and years.
              <Calendar
                value={selected ?? focus}
                onChange={(d) => {
                  choose(d);
                  closeJump();
                }}
                header="picker"
                yearRange={[fromYear, toYear]}
                weekStartsOn={weekStartsOn}
                locale={locale}
              />
            )}
          </div>
        </Portal>
      )}

      {mode === 'year' && (
        <div {...part('year', styles.year)} role="list" aria-label={title}>
          {monthNames.map((_, m) => {
            const mDate = new Date(first.getFullYear(), m, 1);
            const mEnd = new Date(first.getFullYear(), m + 1, 0);
            const inMonth = events.filter((e) => !before(lastDay(e), mDate) && !before(mEnd, e.start));
            const current = sameMonth(mDate, today);
            return (
              <div key={m} role="listitem" className={styles.monthCellWrap}>
                <button
                  type="button"
                  {...part('monthCell', [styles.monthCell, current && styles.current])}
                  aria-current={current ? 'date' : undefined}
                  onClick={() => {
                    goMonth(first.getFullYear(), m);
                    setMode('month');
                  }}
                >
                  <span className={styles.monthName}>{formatDate(mDate, locale, { month: 'long' })}</span>
                  <span className={styles.monthCount}>
                    {inMonth.length === 0 ? 'No events' : `${inMonth.length} ${inMonth.length === 1 ? 'event' : 'events'}`}
                  </span>
                  {inMonth.length > 0 && (
                    <span className={styles.monthDots} aria-hidden="true">
                      {inMonth.slice(0, 6).map((e) => {
                        const c = colourProps(e.color);
                        return <span key={e.id} className={cx(styles.dot, c.className)} style={c.style} />;
                      })}
                    </span>
                  )}
                </button>
                {renderMonth && <div {...part('extra', styles.extra)}>{renderMonth(mDate, inMonth)}</div>}
              </div>
            );
          })}
        </div>
      )}

      {(mode === 'day' || mode === 'week') && (
        <TimeGrid
          days={days}
          events={events}
          today={today}
          locale={locale}
          hourHeight={hourHeight}
          startHour={startHour}
          maxEvents={maxEvents}
          time={time}
          eventButton={eventButton}
          onDayClick={mode === 'week' && views.includes('day') ? (d) => {
            goDay(d);
            setMode('day');
          } : undefined}
          onSlotClick={onSlotClick}
          part={part}
        />
      )}

      {mode === 'month' && (
        <>
          <div ref={grid} {...part('month', styles.month)} role="grid" aria-label={title} onKeyDown={onKey}>
            <div className={styles.weekdays} role="row">
              {weekdays.map((w) => (
                <span key={w.long} role="columnheader" {...part('weekday', styles.weekday)}>
                  <abbr title={w.long}>{w.short}</abbr>
                </span>
              ))}
            </div>
            {weeks.map((week) => {
              const placed = layoutRows(events, week[0]!, 7);
              const hidden = week.map((_, i) => placed.filter((p) => p.row >= maxEvents && p.from <= i && p.to >= i).map((p) => p.event));
              const rows = Math.min(maxEvents, placed.reduce((n, p) => Math.max(n, p.row + 1), 0));
              return (
                <div
                  key={week[0]!.toISOString()}
                  role="row"
                  {...part('week', styles.week, { '--rows': rows + (hidden.some((h) => h.length) ? 1 : 0) } as CSSProperties)}
                >
                  {week.map((d, i) => {
                    const dayEvents = events.filter((e) => onDay(e, d));
                    const isSelected = sameDay(d, selected);
                    return (
                      <div
                        key={d.toISOString()}
                        role="gridcell"
                        aria-selected={isSelected || undefined}
                        {...part('day', [styles.day, !sameMonth(d, first) && styles.outside, isSelected && styles.selected], { gridColumn: i + 1 })}
                      >
                        <button
                          type="button"
                          data-day={d.toDateString()}
                          tabIndex={sameDay(d, tabbable) ? 0 : -1}
                          aria-current={sameDay(d, today) ? 'date' : undefined}
                          aria-label={`${formatDate(d, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? 'event' : 'events'}` : ''}`}
                          {...part('date', [styles.date, sameDay(d, today) && styles.today])}
                          onClick={() => choose(d)}
                          onFocus={() => setFocus(d)}
                        >
                          {d.getDate()}
                        </button>
                        {dayEvents.length > 0 && (
                          <span className={styles.dots} aria-hidden="true">
                            {dayEvents.slice(0, 3).map((e) => {
                              const c = colourProps(e.color);
                              return <span key={e.id} className={cx(styles.dot, c.className)} style={c.style} />;
                            })}
                          </span>
                        )}
                        {renderDay && <div {...part('extra', styles.extra)}>{renderDay(d, dayEvents)}</div>}
                      </div>
                    );
                  })}
                  {/* The week's events sit in one cell of their own, since a grid row may only hold cells */}
                  <div role="gridcell" style={{ display: 'contents' }}>
                  {placed
                    .filter((p) => p.row < maxEvents)
                    .map((p) =>
                      eventButton(
                        p.event,
                        cx(styles.bar, isTimed(p.event) && styles.timedBar, before(p.event.start, week[0]!) && styles.continuesBefore, before(week[6]!, lastDay(p.event)) && styles.continuesAfter),
                        { gridColumn: `${p.from + 1} / ${p.to + 2}`, gridRow: p.row + 2 },
                      ),
                    )}
                  {hidden.map((list, i) =>
                    list.length ? (
                      <span key={i} {...part('more', styles.moreWrap, { gridColumn: i + 1, gridRow: maxEvents + 2 })}>
                        <Popover
                          title={formatDate(week[i]!, locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                          showClose
                          trigger={<button type="button" className={styles.more}>+{list.length} more</button>}
                        >
                          <span className={styles.popList}>{events.filter((e) => onDay(e, week[i]!)).map((e) => eventButton(e, styles.listEvent))}</span>
                        </Popover>
                      </span>
                    ) : null,
                  )}
                  </div>
                </div>
              );
            })}
          </div>
          <section {...part('agenda', styles.agenda)} aria-label={`Events on ${formatDate(agendaDay, locale, { day: 'numeric', month: 'long' })}`}>
            <h3 className={styles.agendaTitle}>{formatDate(agendaDay, locale, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
            {agenda.length === 0 ? (
              <p className={styles.empty}>No events</p>
            ) : (
              <span className={styles.popList}>{agenda.map((e) => eventButton(e, styles.listEvent))}</span>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function weekTitle(a: Date, b: Date, locale?: string) {
  const f = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  return typeof f.formatRange === 'function' ? f.formatRange(a, b) : `${f.format(a)} to ${f.format(b)}`;
}

interface TimeGridProps {
  days: Date[];
  events: CalendarEvent[];
  today: Date;
  locale?: string;
  hourHeight: number;
  startHour: number;
  maxEvents: number;
  time: (d: Date) => string;
  eventButton: (e: CalendarEvent, extra?: string, style?: CSSProperties, children?: ReactNode) => ReactNode;
  onDayClick?: (d: Date) => void;
  onSlotClick?: (d: Date) => void;
  part: ReturnType<typeof parts<EventCalendarPart>>;
}

/** Hours down the side, days across, and timed events placed by their start and end. */
function TimeGrid({ days, events, today, locale, hourHeight, startHour, maxEvents, time, eventButton, onDayClick, onSlotClick, part }: TimeGridProps) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = startHour * hourHeight;
  }, [startHour, hourHeight, days.length]);

  const dayEvents = events.filter((e) => !isTimed(e));
  const placed = layoutRows(dayEvents, days[0]!, days.length);
  const rows = Math.min(maxEvents, placed.reduce((n, p) => Math.max(n, p.row + 1), 0));
  const hours = Array.from({ length: 24 }, (_, h) => h);
  const hourLabel = (h: number) => formatDate(new Date(2024, 0, 1, h), locale, { hour: 'numeric' });

  const slot = (d: Date, e: MouseEvent<HTMLDivElement>) => {
    if (!onSlotClick || e.target !== e.currentTarget) return;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const mins = Math.max(0, Math.min(23.5 * 60, Math.floor((y / hourHeight) * 2) * 30));
    onSlotClick(new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(mins / 60), mins % 60));
  };

  return (
    <div {...part('timeGrid', styles.timeGrid, { '--cols': days.length, '--hour': `${hourHeight}px` } as CSSProperties)}>
      <div ref={scroller} className={styles.tgScroll}>
        {/* Sticky inside the scroller, so the day columns line up with the hours below whatever the scrollbar. */}
        <div className={styles.tgSticky}>
          <div className={styles.tgHead}>
            <span className={styles.gutter} />
            {days.map((d) => {
              const content = (
                <>
                  <span className={styles.tgWeekday}>{formatDate(d, locale, { weekday: 'short' })}</span>
                  <span className={cx(styles.tgDate, sameDay(d, today) && styles.today)}>{d.getDate()}</span>
                </>
              );
              const label = formatDate(d, locale, { weekday: 'long', day: 'numeric', month: 'long' });
              const current = sameDay(d, today) ? 'date' : undefined;
              return onDayClick ? (
                <button key={d.toISOString()} type="button" {...part('dayHeader', styles.tgDay)} aria-current={current} onClick={() => onDayClick(d)}>
                  {content}
                  <span className={styles.srOnly}>, open {label}</span>
                </button>
              ) : (
                <span key={d.toISOString()} {...part('dayHeader', styles.tgDay)} aria-current={current}>
                  {content}
                </span>
              );
            })}
          </div>
          {placed.length > 0 && (
            <div {...part('allDay', styles.allDay, { '--rows': rows } as CSSProperties)}>
              <span className={styles.allDayLabel}>All day</span>
              {placed
                .filter((p) => p.row < maxEvents)
                .map((p) =>
                  eventButton(
                    p.event,
                    cx(styles.bar, before(p.event.start, days[0]!) && styles.continuesBefore, before(days[days.length - 1]!, lastDay(p.event)) && styles.continuesAfter),
                    { gridColumn: `${p.from + 2} / ${p.to + 3}`, gridRow: p.row + 1 },
                  ),
                )}
            </div>
          )}
        </div>
        <div className={styles.tgBody} style={{ height: hourHeight * 24 }}>
          <div {...part('hours', styles.hours)} aria-hidden="true">
            {hours.slice(1).map((h) => (
              <span key={h} className={styles.hour} style={{ top: h * hourHeight }}>
                {hourLabel(h)}
              </span>
            ))}
          </div>
          {days.map((d) => {
            const timed = layoutTimed(events.filter((e) => isTimed(e) && sameDay(e.start, d)));
            return (
              <div key={d.toISOString()} {...part('column', styles.tgCol)} onClick={(e) => slot(d, e)} data-clickable={!!onSlotClick || undefined}>
                {timed.map(({ event: e, col, cols }) => {
                  const top = (minutes(e.start) / 60) * hourHeight;
                  const height = Math.max(20, ((endMin(e) - minutes(e.start)) / 60) * hourHeight - 2);
                  return eventButton(
                    e,
                    styles.block,
                    { top, height, left: `calc(${(col / cols) * 100}% + 2px)`, width: `calc(${100 / cols}% - 4px)` },
                    <>
                      {e.avatar && <span className={styles.eventAvatar} aria-hidden="true">{e.avatar}</span>}
                      <span className={styles.blockText}>
                        <span className={styles.eventTitle}>{e.title}</span>
                        {height >= 36 && (
                          <span className={styles.blockTime}>
                            {e.detail ?? (
                              <>
                                {time(e.start)}
                                {e.end ? ` – ${time(e.end)}` : ''}
                              </>
                            )}
                          </span>
                        )}
                      </span>
                    </>,
                  );
                })}
                {sameDay(d, today) && <span {...part('now', styles.now, { top: (minutes(now) / 60) * hourHeight })} aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
