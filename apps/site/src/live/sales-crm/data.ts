// Sample data for Veyra, a made-up sales CRM.
import { photo } from '../kit';

export const people = {
  kemi: { name: 'Kemi Martins', role: 'Enterprise', email: 'kemi@veyra.io', src: photo('photo-08.jpg') },
  tolu: { name: 'Tolu Adeyemi', role: 'Mid-market', src: photo('notionists-03.png') },
  jonas: { name: 'Jonas Schmidt', role: 'Enterprise', src: photo('photo-01.jpg') },
  mina: { name: 'Mina Kato', role: 'Small business', src: photo('notionists-02.png') },
};
export type Rep = (typeof people)[keyof typeof people];

export const contacts = [
  { id: 'ada', name: 'Ada Nwachukwu', title: 'Head of operations', company: 'Kestrel Bank', stage: 'Customer', owner: people.kemi, last: 'Today', order: 0, src: photo('photo-07.jpg') },
  { id: 'sofia', name: 'Sofia Lindqvist', title: 'COO', company: 'Orbit Freight', stage: 'Lead', owner: people.tolu, last: 'Yesterday', order: 1, src: photo('photo-02.jpg') },
  { id: 'grace', name: 'Grace Adeyemi', title: 'Finance director', company: 'Lumen Health', stage: 'Lead', owner: people.kemi, last: '8 Oct', order: 2, src: photo('photo-09.jpg') },
  { id: 'lucas', name: 'Lucas Ferreira', title: 'Buyer', company: 'Fieldstone', stage: 'Lead', owner: people.jonas, last: '6 Oct', order: 3, src: photo('photo-03.jpg') },
  { id: 'femi', name: 'Femi Oladipo', title: 'Procurement', company: 'Kestrel Bank', stage: 'Customer', owner: people.kemi, last: '5 Oct', order: 4, src: photo('notionists-04.png') },
  { id: 'amaka', name: 'Amaka Uche', title: 'Founder', company: 'Tidewater', stage: 'Customer', owner: people.mina, last: '2 Oct', order: 5, src: photo('photo-10.jpg') },
  { id: 'kenji', name: 'Kenji Arai', title: 'IT manager', company: 'Copperline', stage: 'Cold', owner: people.jonas, last: '14 Sep', order: 6, src: photo('photo-05.jpg') },
  { id: 'rita', name: 'Rita Sule', title: 'Legal', company: 'Kestrel Bank', stage: 'Customer', owner: people.kemi, last: '12 Sep', order: 7, src: photo('photo-06.jpg') },
  { id: 'temi', name: 'Temi Bakare', title: 'CEO', company: 'Solin Media', stage: 'Lead', owner: people.tolu, last: '10 Sep', order: 8, src: photo('photo-06.jpg') },
  { id: 'amara', name: 'Amara Bello', title: 'Head of growth', company: 'Solin Media', stage: 'Lead', owner: people.tolu, last: '9 Sep', order: 9, src: photo('photo-09.jpg') },
];
export type Contact = (typeof contacts)[number];

export type Stage = 'Qualified' | 'Proposal' | 'Negotiation' | 'Won';
export const stages: Stage[] = ['Qualified', 'Proposal', 'Negotiation', 'Won'];

export interface Deal {
  id: string;
  company: string;
  value: number;
  stage: Stage;
  closes: string;
  team: Rep[];
  contact: Contact;
}

const c = (id: string) => contacts.find((x) => x.id === id)!;

export const deals: Deal[] = [
  { id: 'lumen', company: 'Lumen Health', value: 48000, stage: 'Qualified', closes: 'Closes 30 Oct', team: [people.tolu], contact: c('grace') },
  { id: 'northpeak', company: 'Northpeak', value: 22500, stage: 'Qualified', closes: 'Closes 14 Nov', team: [people.mina], contact: c('kenji') },
  { id: 'orbit', company: 'Orbit Freight', value: 86000, stage: 'Proposal', closes: 'Closes 31 Oct', team: [people.jonas, people.kemi], contact: c('sofia') },
  { id: 'copperline', company: 'Copperline', value: 31000, stage: 'Proposal', closes: 'Closes 20 Nov', team: [people.jonas], contact: c('lucas') },
  { id: 'kestrel', company: 'Kestrel Bank', value: 48000, stage: 'Negotiation', closes: 'Closes 30 Oct', team: [people.kemi, people.tolu], contact: c('ada') },
  { id: 'fieldstone', company: 'Fieldstone', value: 64000, stage: 'Negotiation', closes: 'Closes 2 Dec', team: [people.mina, people.jonas], contact: c('lucas') },
  { id: 'harbor', company: 'Harbor & Co', value: 92000, stage: 'Won', closes: 'Signed 21 Oct', team: [people.kemi], contact: c('amaka') },
  { id: 'tidewater', company: 'Tidewater', value: 41000, stage: 'Won', closes: 'Signed 18 Oct', team: [people.mina, people.jonas], contact: c('amaka') },
];

export const stageTotals: Record<Stage, { count: number; value: string }> = {
  Qualified: { count: 9, value: '$312K' },
  Proposal: { count: 7, value: '$402K' },
  Negotiation: { count: 5, value: '$356K' },
  Won: { count: 3, value: '$170K' },
};

export const performers = [
  { who: people.kemi, deals: 9, value: 142000 },
  { who: people.tolu, deals: 7, value: 98500 },
  { who: people.jonas, deals: 6, value: 81000 },
  { who: people.mina, deals: 5, value: 64500 },
];

export const ratings = [
  { stars: 5, share: 68 },
  { stars: 4, share: 21 },
  { stars: 3, share: 7 },
  { stars: 2, share: 3 },
  { stars: 1, share: 1 },
];

export const dollars = (n: number) => `$${n.toLocaleString('en-US')}`;
