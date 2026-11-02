// Sample data for Solin, a made-up app for creators who sell calls, webinars and downloads.
import { photo } from '../kit';

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export const me = { name: 'Temi Bakare', first: 'Temi', email: 'temi@solin.page', src: photo('photo-06.jpg') };

export const calls = [
  { id: 'kofi', who: 'Kofi Mensah', what: 'Portfolio review · 45 min', when: 'Today, 2:00 PM', soon: true, src: photo('notionists-01.png') },
  { id: 'zainab', who: 'Zainab Bello', what: 'Career coaching · 30 min', when: 'Today, 4:30 PM', soon: false, src: photo('photo-07.jpg') },
  { id: 'lucas', who: 'Lucas Ferreira', what: 'Portfolio review · 45 min', when: 'Tomorrow, 10:00 AM', soon: false, src: photo('photo-03.jpg') },
  { id: 'amara', who: 'Amara Nwosu', what: 'Mock interview · 60 min', when: 'Fri 16 Oct, 1:00 PM', soon: false, src: photo('photo-09.jpg') },
];

export const buyers = [photo('photo-08.jpg'), photo('photo-10.jpg'), photo('photo-03.jpg'), photo('photo-02.jpg')];

export type ProductStatus = 'Published' | 'Draft';
export const products: { id: string; name: string; about: string; price: number; sales: number; status: ProductStatus }[] = [
  { id: 'p1', name: 'Portfolio playbook', about: 'E-book, 64 pages', price: 12000, sales: 58, status: 'Published' },
  { id: 'p2', name: 'Case study templates', about: 'Figma file', price: 18500, sales: 41, status: 'Published' },
  { id: 'p3', name: 'Interview prep course', about: '6 video lessons', price: 45000, sales: 30, status: 'Published' },
  { id: 'p4', name: 'Rate card calculator', about: 'Spreadsheet', price: 5000, sales: 0, status: 'Draft' },
];

export type PayoutStatus = 'Paid' | 'Returned';
export const payouts: { id: string; date: string; sort: number; to: string; status: PayoutStatus; amount: number }[] = [
  { id: 'o1', date: 'Mon 5 Oct 2026', sort: 4, to: 'Kova ··7782', status: 'Paid', amount: 412000 },
  { id: 'o2', date: 'Mon 28 Sep 2026', sort: 3, to: 'Kova ··7782', status: 'Paid', amount: 386500 },
  { id: 'o3', date: 'Mon 21 Sep 2026', sort: 2, to: 'Kova ··7782', status: 'Paid', amount: 295000 },
  { id: 'o4', date: 'Tue 15 Sep 2026', sort: 1, to: 'Kova ··7782', status: 'Returned', amount: 120000 },
];
