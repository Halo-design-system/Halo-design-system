// Nimbo's frame: its logo, menu and signed-in doctor, in the shared app layout.
import type { ReactNode } from 'react';
import { CalendarBlank, ChartBar, FileText, Gear, Question, Receipt, SquaresFour, UsersThree } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import { me } from './data';

export function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--halo-spacing-4)', fontWeight: 'var(--halo-font-weight-semibold)' }}>
      <svg width="32" height="24" viewBox="0 0 32 24" aria-hidden="true" style={{ fill: 'var(--halo-icon-primary)' }}>
        <path d="M8 24a8 8 0 0 1-1.5-15.9A10 10 0 0 1 25.4 7 8.5 8.5 0 0 1 24 24Z" />
      </svg>
      Nimbo
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Nimbo"
      logo={<Logo />}
      current={current}
      settings="settings"
      logout="today"
      user={me}
      main={[
        { id: 'today', label: 'Today', icon: <SquaresFour /> },
        { id: 'appointments', label: 'Appointments', icon: <CalendarBlank /> },
        { id: 'patient', label: 'Patients', icon: <UsersThree /> },
        { id: 'records', label: 'Records', icon: <FileText /> },
        { id: 'billing', label: 'Billing', icon: <Receipt /> },
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
