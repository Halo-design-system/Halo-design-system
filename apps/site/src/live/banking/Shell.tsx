// Kova's frame: its logo, menu and signed-in person, in the shared app layout.
import type { ReactNode } from 'react';
import { ArrowsLeftRight, CreditCard, Gear, House, PiggyBank, Question, Receipt, Wallet } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import { me } from './data';
import './banking.css';

export function Logo() {
  return (
    <span className="kova-logo">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <path d="M15 1 29 15 15 29 1 15Z" />
        <path d="M15 10 20 15 15 20 10 15Z" className="kova-logo-hole" />
      </svg>
      Kova
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Kova"
      logo={<Logo />}
      current={current}
      settings="settings"
      logout="home"
      user={me}
      main={[
        { id: 'home', label: 'Home', icon: <House /> },
        { id: 'wallets', label: 'Wallets', icon: <Wallet /> },
        { id: 'send', label: 'Payments', icon: <ArrowsLeftRight /> },
        { id: 'cards', label: 'Cards', icon: <CreditCard /> },
        { id: 'goal', label: 'Savings', icon: <PiggyBank /> },
        { id: 'bills', label: 'Bills', icon: <Receipt /> },
      ]}
      more={[
        { id: 'settings', label: 'Settings', icon: <Gear /> },
        { id: 'help', label: 'Help', icon: <Question /> },
      ]}
    >
      {children}
    </AppShell>
  );
}
