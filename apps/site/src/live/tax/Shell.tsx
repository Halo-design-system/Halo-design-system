// Zephra's frame: its logo, menu and signed-in person, in the shared app layout.
import type { ReactNode } from 'react';
import { Bank, CalendarBlank, ChartBar, FileText, Gear, Question, Receipt, SquaresFour } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import { me } from './data';
import './tax.css';

export function Logo() {
  return (
    <span className="zephra-logo">
      <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden="true">
        <rect x="0" y="0" width="30" height="6" rx="3" />
        <rect x="0" y="10" width="20" height="6" rx="3" />
        <rect x="0" y="20" width="8" height="6" rx="3" />
      </svg>
      Zephra
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Zephra"
      logo={<Logo />}
      current={current}
      settings="settings"
      logout="overview"
      user={me}
      main={[
        { id: 'overview', label: 'Overview', icon: <SquaresFour /> },
        { id: 'return', label: 'Returns', icon: <FileText /> },
        { id: 'receipts', label: 'Receipts', icon: <Receipt /> },
        { id: 'deadlines', label: 'Deadlines', icon: <CalendarBlank /> },
        { id: 'paid', label: 'Payments', icon: <Bank /> },
        { id: 'reports', label: 'Reports', icon: <ChartBar /> },
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
