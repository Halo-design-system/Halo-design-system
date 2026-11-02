// Sample data for Nimbo, a made-up clinic app. Patients and results are invented.
import { photo } from '../kit';

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export const me = { name: 'Dr. Ifeoma Chukwu', short: 'Dr. Chukwu', email: 'ifeoma@nimbo.health', src: photo('photo-08.jpg') };

export const patients = {
  halima: { name: 'Halima Yusuf', about: '29 yrs · Female', src: photo('photo-07.jpg') },
  grace: { name: 'Grace Eze', about: '56 yrs · Female', src: photo('photo-06.jpg') },
  chidi: { name: 'Chidi Okeke', about: '47 yrs · Male', src: photo('notionists-03.png') },
  musa: { name: 'Musa Danjuma', about: '38 yrs · Male', src: photo('notionists-04.png') },
  tunde: { name: 'Tunde Ajayi', about: '33 yrs · Male', src: photo('notionists-05.png') },
};
export type Patient = (typeof patients)[keyof typeof patients];

export type Visit = 'In consultation' | 'Waiting' | 'Checked in' | 'Booked' | 'Seen';
export const schedule: { id: string; time: string; who: Patient; why: string; status: Visit }[] = [
  { id: 'a1', time: '10:30 AM', who: patients.chidi, why: 'Follow-up, blood pressure', status: 'In consultation' },
  { id: 'a2', time: '11:00 AM', who: patients.halima, why: 'Antenatal check, 28 weeks', status: 'Waiting' },
  { id: 'a3', time: '11:30 AM', who: patients.tunde, why: 'Cough and fever, 3 days', status: 'Checked in' },
  { id: 'a4', time: '12:15 PM', who: patients.grace, why: 'Diabetes review', status: 'Booked' },
  { id: 'a5', time: '1:00 PM', who: patients.musa, why: 'Lab results discussion', status: 'Booked' },
];

export const labs: { id: string; test: string; who: string; result: string; tone: 'error' | 'warning' | 'success' }[] = [
  { id: 'l1', test: 'Full blood count', who: 'Musa Danjuma', result: 'Low haemoglobin', tone: 'error' },
  { id: 'l2', test: 'HbA1c', who: 'Grace Eze', result: '7.9%, above target', tone: 'warning' },
  { id: 'l3', test: 'Malaria test', who: 'Tunde Ajayi', result: 'Negative', tone: 'success' },
  { id: 'l4', test: 'Lipid profile', who: 'Chidi Okeke', result: 'Normal', tone: 'success' },
];

export type Standing = 'Follow-up due' | 'Stable' | 'In treatment' | 'Results ready';
export const roster: { id: string; who: Patient; last: Date; condition: string; doctor: string; status: Standing }[] = [
  { id: 'p1', who: patients.halima, last: new Date(2026, 9, 3), condition: 'Pregnancy, 28 weeks', doctor: 'Dr. Ifeoma Chukwu', status: 'Follow-up due' },
  { id: 'p2', who: patients.grace, last: new Date(2026, 8, 12), condition: 'Type 2 diabetes', doctor: 'Dr. Ifeoma Chukwu', status: 'Stable' },
  { id: 'p3', who: patients.chidi, last: new Date(2026, 9, 10), condition: 'High blood pressure', doctor: 'Dr. Samuel Obi', status: 'In treatment' },
  { id: 'p4', who: patients.musa, last: new Date(2026, 9, 8), condition: 'Anaemia, under review', doctor: 'Dr. Samuel Obi', status: 'Results ready' },
  { id: 'p5', who: patients.tunde, last: new Date(2026, 9, 10), condition: 'Respiratory infection', doctor: 'Dr. Ifeoma Chukwu', status: 'In treatment' },
];

export type InvoiceStatus = 'Claim sent' | 'Paid' | 'Unpaid';
export const invoices: { id: string; who: Patient; what: string; payer: string; status: InvoiceStatus; amount: number }[] = [
  { id: 'NB-1042', who: patients.musa, what: 'Lab tests, consultation', payer: 'Reliance Care HMO', status: 'Claim sent', amount: 48500 },
  { id: 'NB-1041', who: patients.halima, what: 'Antenatal check', payer: 'Self-pay', status: 'Paid', amount: 15000 },
  { id: 'NB-1040', who: patients.chidi, what: 'Consultation, ECG', payer: 'Self-pay', status: 'Unpaid', amount: 32000 },
  { id: 'NB-1039', who: patients.grace, what: 'Diabetes review', payer: 'Hygeia HMO', status: 'Paid', amount: 22000 },
  { id: 'NB-1038', who: patients.tunde, what: 'Consultation, malaria test', payer: 'Self-pay', status: 'Unpaid', amount: 18000 },
];

export const day = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
