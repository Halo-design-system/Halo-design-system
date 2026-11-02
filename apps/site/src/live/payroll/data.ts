// Sample data for Arko, a made-up payroll app.
import { photo } from '../kit';

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export const me = { name: 'Bisi Lawal', email: 'bisi@arkopay.co', src: photo('photo-10.jpg') };

export type PayStatus = 'Ready' | 'New this month' | 'No bank details';
export type StaffStatus = 'Active' | 'On leave' | 'Needs details';

export interface Employee {
  id: string;
  name: string;
  role: string;
  team: string;
  gross: number;
  paye: number;
  pension: number;
  bank: string;
  pay: PayStatus;
  status: StaffStatus;
  src: string;
}

const net = (e: Pick<Employee, 'gross' | 'paye' | 'pension'>) => e.gross - e.paye - e.pension;
export const netOf = net;

export const staff: Employee[] = [
  { id: 'kemi', name: 'Kemi Martins', role: 'Head of sales', team: 'Sales', gross: 650000, paye: 121400, pension: 52000, bank: 'Kova ··1182', pay: 'Ready', status: 'Active', src: photo('photo-08.jpg') },
  { id: 'jonas', name: 'Jonas Schmidt', role: 'Senior engineer', team: 'Engineering', gross: 780000, paye: 150300, pension: 62400, bank: 'Zenith ··9031', pay: 'Ready', status: 'Active', src: photo('photo-01.jpg') },
  { id: 'mina', name: 'Mina Kato', role: 'Product designer', team: 'Design', gross: 480000, paye: 83700, pension: 38400, bank: 'GTBank ··5520', pay: 'Ready', status: 'On leave', src: photo('notionists-02.png') },
  { id: 'tolu', name: 'Tolu Adeyemi', role: 'Account executive', team: 'Sales', gross: 420000, paye: 70500, pension: 33600, bank: 'Access ··2048', pay: 'New this month', status: 'Active', src: photo('notionists-03.png') },
  { id: 'david', name: 'David Okon', role: 'Support lead', team: 'Operations', gross: 310000, paye: 46300, pension: 24800, bank: 'Missing', pay: 'No bank details', status: 'Needs details', src: photo('notionists-05.png') },
  { id: 'sade', name: 'Sade Bello', role: 'Office manager', team: 'Admin', gross: 260000, paye: 35200, pension: 20800, bank: 'Missing', pay: 'No bank details', status: 'Needs details', src: photo('photo-06.jpg') },
];

export const costByMonth = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({ m, cost: [15.2, 15.6, 16.4, 16.8, 17.6, 18.42][i] }));

export const costByTeam = [
  { team: 'Engineering', cost: 7.7 },
  { team: 'Sales', cost: 4.1 },
  { team: 'Operations', cost: 3.3 },
  { team: 'Design', cost: 1.8 },
  { team: 'Admin', cost: 1.5 },
];

export const leave = [
  { id: 'l1', title: 'Kemi Martins', start: new Date(2026, 9, 8), end: new Date(2026, 9, 12), color: 'blue' },
  { id: 'l2', title: 'Amaka Uche', start: new Date(2026, 9, 14), end: new Date(2026, 9, 15), color: 'blue' },
  { id: 'l3', title: 'Jonas Schmidt', start: new Date(2026, 9, 14), color: 'red' },
  { id: 'l4', title: 'Mina Kato', start: new Date(2026, 9, 14), color: 'green' },
  { id: 'l5', title: 'David Okon', start: new Date(2026, 9, 14), color: 'yellow' },
  { id: 'l6', title: 'Lucas Ferreira', start: new Date(2026, 9, 20), end: new Date(2026, 9, 22), color: 'blue' },
  { id: 'l7', title: 'Funmi Ade', start: new Date(2026, 9, 28), end: new Date(2026, 9, 29), color: 'yellow' },
];

export const requests = [
  { id: 'r1', who: 'Lucas Ferreira', what: 'Annual leave · 20 to 22 Oct · 3 days', src: photo('photo-03.jpg') },
  { id: 'r2', who: 'Funmi Ade', what: 'Personal · 28 to 29 Oct · 2 days', src: photo('photo-09.jpg') },
  { id: 'r3', who: 'Tolu Adeyemi', what: 'Training · 4 Nov · 1 day', src: photo('notionists-03.png') },
];
