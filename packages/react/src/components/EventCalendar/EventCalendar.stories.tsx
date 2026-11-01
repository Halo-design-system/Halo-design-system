import { useState } from 'react';
import { Avatar } from '../Avatar';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventCalendar } from './EventCalendar';
import type { CalendarEvent } from './EventCalendar';

const now = new Date();
const day = (d: number) => new Date(now.getFullYear(), now.getMonth(), d);
const at = (d: number, h: number, m = 0) => new Date(now.getFullYear(), now.getMonth(), d, h, m);
const td = now.getDate();

const events: CalendarEvent[] = [
  { id: '1', title: 'Release window', start: day(8), end: day(12), color: 'blue' },
  { id: '2', title: 'Design review', start: day(14), color: 'green' },
  { id: '3', title: 'Team offsite', start: day(20), end: day(22), color: 'purple' },
  { id: '4', title: 'Payroll run', start: day(25), color: 'orange' },
  { id: '5', title: 'Quarterly planning', start: day(14), end: day(15), color: 'yellow' },
  { id: '6', title: 'Interviews', start: day(14), color: 'pink' },
  { id: '7', title: 'Board update', start: day(14), color: 'red' },
  { id: '8', title: 'Launch party', start: day(3), color: '#0EA5E9' },
  { id: '9', title: 'Holiday', start: day(28), end: day(29) },
  // Timed events this week, for the day and week views.
  { id: '10', title: 'Standup', start: at(td, 9, 0), end: at(td, 9, 30), color: 'blue' },
  { id: '11', title: 'Customer call', start: at(td, 10, 0), end: at(td, 11, 0), color: 'green' },
  { id: '12', title: 'Pairing', start: at(td, 10, 30), end: at(td, 12, 0), color: 'purple' },
  { id: '13', title: 'Lunch with Ada', start: at(td, 12, 30), end: at(td, 13, 30), color: 'orange' },
  { id: '14', title: 'Roadmap review', start: at(td + 1, 14, 0), end: at(td + 1, 15, 30), color: 'yellow' },
  { id: '15', title: 'Standup', start: at(td + 1, 9, 0), end: at(td + 1, 9, 30), color: 'blue' },
  { id: '16', title: '1:1 with Sam', start: at(td - 1, 16, 0), end: at(td - 1, 16, 45), color: 'pink' },
  { id: '17', title: 'Hiring panel', start: at(td + 2, 11, 0), end: at(td + 2, 12, 30), color: 'red' },
];

const meta = {
  title: 'Components/Calendar/Event calendar',
  component: EventCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A full-size calendar for planning. The header jumps to any year and month, and a Month and Year switch changes the view. Events over several days run as one bar; a busy day shows "+2 more". Under 600px wide it switches to dots, with the chosen day\'s events listed underneath. Arrow keys move between days. Use `renderDay` to add your own content to each day.',
      },
    },
  },
  args: { events },
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Hours down the side and the week across, like a planner. Overlapping events sit side by side, events over several days sit in the all-day row, and a line marks the time now. Click a date to open that day. */
export const Week: Story = { args: { defaultView: 'week' } };

/** One day of hours. Click an empty slot to get its time, for example to add an event there. */
export const Day: Story = {
  render: function Render(args) {
    const [slot, setSlot] = useState<Date | null>(null);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <EventCalendar {...args} defaultView="day" onSlotClick={setSlot} />
        <span style={{ fontFamily: 'var(--halo-font-family-body)', fontSize: 14 }}>{slot ? `Add an event at ${slot.toLocaleString()}` : 'Click an empty slot.'}</span>
      </div>
    );
  },
};

/** Appointments: an Avatar for each person and the reason under their name, in a clinic's week. */
export const Appointments: Story = {
  args: {
    defaultView: 'week',
    events: [
      { id: 'a1', title: 'Sade', detail: 'Check-up', start: at(td, 10), end: at(td, 11), avatar: <Avatar size="xs" name="Sade Bello" /> },
      { id: 'a2', title: 'Halima', detail: 'Antenatal', start: at(td, 11), end: at(td, 12), color: 'blue', avatar: <Avatar size="xs" name="Halima Yusuf" /> },
      { id: 'a3', title: 'Kemi', detail: 'Vaccination', start: at(td - 1, 12), end: at(td - 1, 13), avatar: <Avatar size="xs" name="Kemi Ade" /> },
      { id: 'a4', title: 'Obinna', detail: 'Back pain', start: at(td - 2, 9), end: at(td - 2, 10), avatar: <Avatar size="xs" name="Obinna Eze" /> },
    ],
  },
};

/** Just the title and arrows, with no view switch. */
export const SimpleHeader: Story = { args: { header: 'simple' } };

/** The twelve months, each with how many events it holds. Pick one to open it. */
export const YearView: Story = { args: { defaultView: 'year' } };

/** On a phone: dots in each day, and the chosen day's events below. */
export const Mobile: Story = {
  render: (args) => (
    <div style={{ width: 375 }}>
      <EventCalendar {...args} />
    </div>
  ),
};

/** Your own content in each day, like room prices. */
export const CustomDays: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Date | null>(null);
    return (
      <EventCalendar
        header="simple"
        value={selected}
        onValueChange={setSelected}
        renderDay={(d) => {
          const price = 80 + ((d.getDate() * 37) % 60);
          return <span style={{ color: price < 100 ? 'var(--halo-tag-green-text)' : 'var(--halo-text-contrast)' }}>₦{price}k</span>;
        }}
      />
    );
  },
};
