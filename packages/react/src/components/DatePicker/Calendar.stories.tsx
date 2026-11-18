import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';
import type { DateRange } from './Calendar';
import { addDays, startOfDay } from './dates';

const today = startOfDay(new Date());

const meta = {
  title: 'Components/Calendar/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A month grid for picking dates, used inside the Date pickers or on its own. Pick one day, a range, or several separate days. Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End to the ends of the week. For a full-page planner with events, use Event calendar.',
      },
    },
  },
  args: { value: today, onChange: () => {} },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The settings that change how it looks and works, together. Each mode keeps its own selection. */
function PlaygroundCalendar({ mode = 'single', months = 1, header = 'picker', weekStartsOn = 1, locale = 'en-GB' }: { mode?: 'single' | 'range' | 'multiple'; months?: 1 | 2; header?: 'arrows' | 'picker'; weekStartsOn?: 0 | 1; locale?: string }) {
  const [date, setDate] = useState<Date | null>(today);
  const [range, setRange] = useState<DateRange | null>([addDays(today, 2), addDays(today, 9)]);
  const [dates, setDates] = useState<Date[]>([addDays(today, 1), addDays(today, 4)]);
  const shared = { months, header, weekStartsOn, locale };
  if (mode === 'range') return <Calendar {...shared} mode="range" value={range} onChange={setRange} />;
  if (mode === 'multiple') return <Calendar {...shared} mode="multiple" value={dates} onChange={setDates} />;
  return <Calendar {...shared} value={date} onChange={setDate} />;
}

export const Playground: Story = {
  args: { mode: 'single', months: 1, header: 'picker', weekStartsOn: 1, locale: 'en-GB' } as never,
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range', 'multiple'] },
    months: { control: 'inline-radio', options: [1, 2] },
    header: { control: 'inline-radio', options: ['picker', 'arrows'] },
    weekStartsOn: { control: 'inline-radio', options: [1, 0], labels: { 1: 'Monday', 0: 'Sunday' } },
    locale: { control: 'select', options: ['en-GB', 'en-US', 'fr-FR', 'de-DE', 'ja-JP'] },
  } as never,
  render: (args) => <PlaygroundCalendar {...(args as unknown as Parameters<typeof PlaygroundCalendar>[0])} />,
};

/** One day. */
export const Single: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | null>(addDays(today, 3));
    return <Calendar value={date} onChange={setDate} />;
  },
};

/** The month name is a button: click it to pick a month, or click the year to pick a year. This is the default. */
export const MonthAndYearPicker: Story = {
  render: function Render() {
    const [d, setD] = useState<Date | null>(today);
    return <Calendar value={d} onChange={setD} style={{ width: 320 }} />;
  },
};

/** `header="arrows"` keeps the month name as plain text, for when people only ever pick dates close by. */
export const ArrowsOnly: Story = {
  render: function Render() {
    const [d, setD] = useState<Date | null>(today);
    return <Calendar value={d} onChange={setD} header="arrows" style={{ width: 320 }} />;
  },
};

/** A start and an end day. */
export const Range: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange | null>([addDays(today, 2), addDays(today, 9)]);
    return <Calendar mode="range" months={1} value={range} onChange={setRange} />;
  },
};

/** Several separate days. Each click adds or removes one. */
export const Multiple: Story = {
  render: function Render() {
    const [dates, setDates] = useState<Date[]>([addDays(today, 1), addDays(today, 4), addDays(today, 8)]);
    return <Calendar mode="multiple" value={dates} onChange={setDates} />;
  },
};
