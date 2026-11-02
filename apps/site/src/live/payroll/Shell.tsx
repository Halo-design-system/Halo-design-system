// Arko's frame: its logo, menu and signed-in person, in the shared app layout.
import type { ReactNode } from 'react';
import { ChartBar, Coins, FileText, Gear, Question, Receipt, SquaresFour, UsersThree } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import { me } from './data';

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" style={{ fill: 'var(--halo-icon-primary)', flexShrink: 0 }}>
      <path d="M0 30V15a15 15 0 0 1 30 0v15h-9V15a6 6 0 0 0-12 0v15Z" />
    </svg>
  );
}

function Brand() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--halo-spacing-4)', fontWeight: 'var(--halo-font-weight-semibold)' }}>
      <Logo />
      Arko
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Arko"
      logo={<Brand />}
      current={current}
      settings="settings"
      logout="overview"
      user={me}
      main={[
        { id: 'overview', label: 'Overview', icon: <SquaresFour /> },
        { id: 'run', label: 'Pay runs', icon: <Coins /> },
        { id: 'time-off', label: 'People', icon: <UsersThree /> },
        { id: 'payslip', label: 'Payslips', icon: <FileText /> },
        { id: 'taxes', label: 'Taxes', icon: <Receipt /> },
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
