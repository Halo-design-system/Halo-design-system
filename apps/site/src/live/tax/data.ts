// Sample data for Zephra, a made-up tax app for freelancers.
import { photo } from '../kit';

export const naira = (n: number) => `${n < 0 ? '-' : ''}₦${Math.abs(n).toLocaleString('en-NG')}`;
export const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const me = { name: 'Ada Obi', email: 'ada@obistudio.co', src: photo('photo-07.jpg') };

export const deadlines = [
  { id: 'vat-sep', name: 'VAT return, September', detail: 'Monthly, FIRS · 21 Oct 2026', status: 'Due soon' as const, kind: 'vat' },
  { id: 'paye', name: 'PAYE remittance', detail: 'Monthly, Lagos IRS · 10 Nov 2026', status: 'Upcoming' as const, kind: 'bank' },
  { id: 'wht', name: 'Withholding tax', detail: 'Quarterly, FIRS · 21 Nov 2026', status: 'Upcoming' as const, kind: 'coins' },
  { id: 'vat-aug', name: 'VAT return, August', detail: 'Monthly, FIRS · 21 Sep 2026', status: 'Filed' as const, kind: 'done' },
];

export const taxPaid = {
  all: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({ m, paid: [82, 96, 128, 85, 94, 138, 92, 106, 140, 0][i] })),
  vat: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({ m, paid: [40, 46, 60, 42, 45, 66, 44, 50, 70, 0][i] })),
  income: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({ m, paid: [42, 50, 68, 43, 49, 72, 48, 56, 70, 0][i] })),
};

export type DocStatus = 'Verified' | 'Needs review' | 'Missing info';
export const documents: { id: string; name: string; about: string; category: string; date: Date; status: DocStatus; amount: number }[] = [
  { id: 'd1', name: 'Invoice #1042', about: 'Client: Brightline Media', category: 'Income', date: new Date(2026, 9, 8), status: 'Verified', amount: 850000 },
  { id: 'd2', name: 'Laptop receipt', about: 'Office equipment', category: 'Deduction', date: new Date(2026, 9, 2), status: 'Needs review', amount: 640000 },
  { id: 'd3', name: 'Health insurance', about: 'Annual premium', category: 'Deduction', date: new Date(2026, 8, 28), status: 'Verified', amount: 180000 },
  { id: 'd4', name: 'Co-working membership', about: 'September', category: 'Deduction', date: new Date(2026, 8, 15), status: 'Missing info', amount: 45000 },
  { id: 'd5', name: 'Invoice #1041', about: 'Client: Solin Ltd', category: 'Income', date: new Date(2026, 8, 12), status: 'Verified', amount: 620000 },
];

export type ReceiptStatus = 'Needs a look' | 'Missing date' | 'Verified';
export const receipts: { id: string; name: string; date: string; amount: number; status: ReceiptStatus }[] = [
  { id: 'r1', name: 'Laptop', date: '2 Oct 2026', amount: 640000, status: 'Needs a look' },
  { id: 'r2', name: 'Co-working, September', date: '15 Sep 2026', amount: 45000, status: 'Missing date' },
  { id: 'r3', name: 'Electricity, office', date: '3 Sep 2026', amount: 18500, status: 'Needs a look' },
  { id: 'r4', name: 'Health insurance', date: '28 Sep 2026', amount: 180000, status: 'Verified' },
  { id: 'r5', name: 'Pension statement', date: '30 Sep 2026', amount: 240000, status: 'Verified' },
  { id: 'r6', name: 'Phone bill', date: '5 Sep 2026', amount: 12000, status: 'Verified' },
];
