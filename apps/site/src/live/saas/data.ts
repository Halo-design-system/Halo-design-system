// Sample data for Tessel, a made-up project tool.
import { photo } from '../kit';

export const people = {
  ada: { name: 'Ada Obi', team: 'Marketing', email: 'ada@tessel.io', src: photo('photo-07.jpg') },
  tolu: { name: 'Tolu Adeyemi', team: 'Design', src: photo('notionists-03.png') },
  mina: { name: 'Mina Kato', team: 'Product', src: photo('notionists-02.png') },
  jonas: { name: 'Jonas Schmidt', team: 'Engineering', src: photo('photo-01.jpg') },
  lara: { name: 'Lara Pinto', team: 'Support', src: photo('photo-04.jpg') },
  nadia: { name: 'Nadia Adewale', team: 'Head of product, Brightline', src: photo('photo-08.jpg') },
};

export type Person = (typeof people)[keyof typeof people];

export type Status = 'In review' | 'On track' | 'At risk' | 'Not started';

export const projects: { id: string; name: string; about: string; owner: Person; status: Status; progress: number; due: Date }[] = [
  { id: 'brand', name: 'Brand refresh', about: 'Design system and new logo', owner: people.tolu, status: 'In review', progress: 72, due: new Date(2026, 10, 12) },
  { id: 'mobile', name: 'Mobile app', about: 'iOS and Android launch', owner: people.jonas, status: 'On track', progress: 58, due: new Date(2026, 10, 30) },
  { id: 'q4', name: 'Q4 roadmap', about: 'Plan for next quarter', owner: people.mina, status: 'On track', progress: 85, due: new Date(2026, 10, 5) },
  { id: 'website', name: 'Website', about: 'New marketing site', owner: people.ada, status: 'At risk', progress: 31, due: new Date(2026, 9, 20) },
  { id: 'help', name: 'Help centre', about: 'Guides and FAQs', owner: people.lara, status: 'Not started', progress: 0, due: new Date(2026, 11, 15) },
  { id: 'billing', name: 'Billing update', about: 'Yearly plans and invoices', owner: people.jonas, status: 'On track', progress: 44, due: new Date(2026, 11, 2) },
  { id: 'onboarding', name: 'Onboarding', about: 'First-run checklist', owner: people.tolu, status: 'In review', progress: 90, due: new Date(2026, 10, 8) },
  { id: 'reports', name: 'Reports', about: 'Weekly team summaries', owner: people.mina, status: 'Not started', progress: 0, due: new Date(2027, 0, 12) },
];

export const activity = [
  { who: people.tolu, what: 'moved Brand refresh to Review', when: '2 min ago' },
  { who: people.mina, what: 'commented on Q4 roadmap', when: '18 min ago' },
  { who: people.jonas, what: 'invited 3 people to Mobile app', when: '1 hour ago' },
  { who: people.ada, what: 'closed 12 tasks in Website', when: '3 hours ago' },
  { who: people.lara, what: 'uploaded Pricing.pdf', when: 'Yesterday' },
];

export const activeUsers = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, i) => ({
  month,
  users: [6200, 6900, 6600, 7800, 8300, 8100, 8900, 9300, 9600, 10100, 10800, 12480][i],
}));

export type Column = 'To do' | 'In progress' | 'In review' | 'Done';

export interface Task {
  id: string;
  title: string;
  label: string;
  who: Person;
  due: string;
  column: Column;
  about?: string;
  checklist?: { text: string; done: boolean }[];
  comments?: { who: Person; when: string; text: string }[];
}

export const tasks: Task[] = [
  { id: 't1', title: 'Collect brand references', label: 'Research', who: people.tolu, due: 'Due 14 Oct', column: 'To do' },
  { id: 't2', title: 'Write tone of voice notes', label: 'Copy', who: people.lara, due: 'Due 18 Oct', column: 'To do' },
  { id: 't3', title: 'Pick 3 font pairs', label: 'Design', who: people.mina, due: 'Due 20 Oct', column: 'To do' },
  {
    id: 't4',
    title: 'Logo sketches, round 2',
    label: 'Design',
    who: people.tolu,
    due: 'Due 15 Oct',
    column: 'In progress',
    about: 'Three logo directions based on the workshop. Focus on the round mark and test it at 16px.',
    checklist: [
      { text: 'Sketch 10 marks', done: true },
      { text: 'Pick top 3 with Mina', done: true },
      { text: 'Draw final versions', done: false },
      { text: 'Test at small sizes', done: false },
    ],
    comments: [
      { who: people.mina, when: '1 hour ago', text: 'Option B reads well small. Can we try it in black only?' },
      { who: people.tolu, when: '40 min ago', text: 'Yes, uploading the mono versions this afternoon.' },
    ],
  },
  { id: 't5', title: 'Colour palette', label: 'Design', who: people.mina, due: 'Due 16 Oct', column: 'In progress' },
  { id: 't6', title: 'Button and input specs', label: 'Design system', who: people.ada, due: 'Due 13 Oct', column: 'In review' },
  { id: 't7', title: 'Kick-off workshop', label: 'Planning', who: people.ada, due: 'Done 2 Oct', column: 'Done' },
  { id: 't8', title: 'Audit of current brand', label: 'Research', who: people.tolu, due: 'Done 6 Oct', column: 'Done' },
];
