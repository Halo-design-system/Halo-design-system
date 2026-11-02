// Sample data for Kova, a made-up banking app.
import { photo } from '../kit';

/** Naira, with kobo: ₦4,250,800.00 */
export const naira = (n: number, kobo = true) => `${n < 0 ? '-' : ''}₦${Math.abs(n).toLocaleString('en-NG', { minimumFractionDigits: kobo ? 2 : 0, maximumFractionDigits: kobo ? 2 : 0 })}`;

export const me = { name: 'Chiamaka Eze', first: 'Chiamaka', email: 'chiamaka@kova.app', src: photo('photo-06.jpg') };

export const wallets = [
  { id: 'ngn', name: 'Naira wallet', balance: 3120000, detail: '**** 2281', money: naira },
  { id: 'usd', name: 'Dollar wallet', balance: 640.2, detail: '**** 7710', money: (n: number) => `$${n.toFixed(2)}` },
  { id: 'savings', name: 'Savings', balance: 880000, detail: '12% a year', money: naira },
];

export const spending = [
  { id: 'food', name: 'Food and drink', spent: 84000, budget: 120000 },
  { id: 'transport', name: 'Transport', spent: 54000, budget: 120000 },
  { id: 'bills', name: 'Bills', spent: 118000, budget: 120000 },
  { id: 'shopping', name: 'Shopping', spent: 36400, budget: 120000 },
  { id: 'fun', name: 'Entertainment', spent: 20000, budget: 50000 },
];

export const cashFlow = {
  months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({ m, in: [620, 640, 760, 650, 790, 720][i], out: [480, 520, 580, 600, 540, 430][i] })),
  year: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({ m, in: [590, 700, 610, 600, 650, 680, 620, 640, 760, 650, 790, 720][i], out: [560, 690, 470, 450, 500, 560, 480, 520, 580, 600, 540, 430][i] })),
};

export const goals = [
  { id: 'laptop', name: 'New laptop', saved: 900000, target: 1200000 },
  { id: 'emergency', name: 'Emergency fund', saved: 1000000, target: 2000000 },
  { id: 'zanzibar', name: 'Trip to Zanzibar', saved: 350000, target: 1400000 },
];

export type TxStatus = 'Completed' | 'Pending' | 'Failed';

export const transactions: { id: string; who: string; what: string; category: string; date: Date; status: TxStatus; amount: number; src?: string }[] = [
  { id: 'x1', who: 'Solin Ltd', what: 'Salary', category: 'Income', date: new Date(2026, 9, 25), status: 'Completed', amount: 450000 },
  { id: 'x2', who: 'Emeka Okafor', what: 'Transfer', category: 'Transfer', date: new Date(2026, 9, 24), status: 'Completed', amount: -25000, src: photo('notionists-03.png') },
  { id: 'x3', who: 'Zephra Energy', what: 'Electricity', category: 'Bills', date: new Date(2026, 9, 23), status: 'Pending', amount: -18500 },
  { id: 'x4', who: 'Nimbo Market', what: 'Card **** 4432', category: 'Shopping', date: new Date(2026, 9, 22), status: 'Completed', amount: -12350 },
  { id: 'x5', who: 'Ride share', what: 'Card **** 4432', category: 'Transport', date: new Date(2026, 9, 21), status: 'Failed', amount: -4200 },
  { id: 'x6', who: "Mama's Kitchen", what: 'Card **** 4432', category: 'Food and drink', date: new Date(2026, 9, 18), status: 'Completed', amount: -6800 },
  { id: 'x7', who: 'Amaka Nwosu', what: 'Transfer', category: 'Income', date: new Date(2026, 9, 15), status: 'Completed', amount: 30000, src: photo('photo-09.jpg') },
];

export const contacts = [
  { id: 'emeka', name: 'Emeka Okafor', first: 'Emeka', bank: 'gtbank', account: '0123456789', src: photo('notionists-03.png') },
  { id: 'amaka', name: 'Amaka Nwosu', first: 'Amaka', bank: 'access', account: '0567812349', src: photo('photo-09.jpg') },
  { id: 'tunde', name: 'Tunde Bakare', first: 'Tunde', bank: 'zenith', account: '2034567811' },
  { id: 'zara', name: 'Zara Bello', first: 'Zara', bank: 'kuda', account: '1100223344', src: photo('photo-10.jpg') },
];

export const banks = [
  { value: 'gtbank', label: 'GTBank' },
  { value: 'access', label: 'Access Bank' },
  { value: 'zenith', label: 'Zenith Bank' },
  { value: 'kuda', label: 'Kuda' },
  { value: 'opay', label: 'OPay' },
];

export const cardActivity = [
  { id: 'c1', who: 'Fresh Market', when: 'Today, 9:14 AM', amount: -12350, kind: 'shop' },
  { id: 'c2', who: 'Ride share', when: 'Yesterday', amount: -4200, kind: 'ride' },
  { id: 'c3', who: "Mama's Kitchen", when: '8 Oct', amount: -6800, kind: 'food' },
];

export const goalHistory: { id: string; what: string; date: Date; type: 'Deposit' | 'Interest' | 'Withdrawal'; amount: number }[] = [
  { id: 'h1', what: 'Automatic saving', date: new Date(2026, 9, 9), type: 'Deposit', amount: 25000 },
  { id: 'h2', what: 'Interest', date: new Date(2026, 9, 9), type: 'Interest', amount: 296 },
  { id: 'h3', what: 'Birthday money', date: new Date(2026, 9, 2), type: 'Deposit', amount: 100000 },
  { id: 'h4', what: 'Automatic saving', date: new Date(2026, 9, 2), type: 'Deposit', amount: 25000 },
  { id: 'h5', what: 'Phone repair', date: new Date(2026, 8, 20), type: 'Withdrawal', amount: -60000 },
];

export const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
