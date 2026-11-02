// Veyra's frame: its menu runs across the top bar instead of a sidebar.
import type { ReactNode } from 'react';
import { AddressBook, Buildings, ChartBar, Gear, Handshake, Question, SquaresFour } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import './crm.css';
import { people } from './data';

export function Logo() {
  return (
    <span className="veyra-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--halo-spacing-4)', fontWeight: 'var(--halo-font-weight-semibold)' }}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style={{ fill: 'var(--halo-icon-primary)' }}>
        <path d="M2 4c4-3 8-1 12 6 4-7 8-9 12-6 3 3 0 11-12 21C2 15-1 7 2 4Z" />
      </svg>
      Veyra
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Veyra"
      layout="top"
      search="Search deals, people"
      logo={<Logo />}
      current={current}
      settings="settings"
      logout="dashboard"
      user={{ name: people.kemi.name, email: people.kemi.email, src: people.kemi.src }}
      main={[
        { id: 'dashboard', label: 'Dashboard', icon: <SquaresFour /> },
        { id: 'pipeline', label: 'Deals', icon: <Handshake /> },
        { id: 'contacts', label: 'Contacts', icon: <AddressBook /> },
        { id: 'companies', label: 'Companies', icon: <Buildings /> },
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
