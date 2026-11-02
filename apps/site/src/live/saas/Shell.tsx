// Tessel's frame: its logo, menu and signed-in person, in the shared app layout.
import type { ReactNode } from 'react';
import { CalendarBlank, ChartBar, FolderSimple, Gear, Question, SquaresFour, Tray, UsersThree } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import { people } from './data';
import './saas.css';

export function Logo() {
  return (
    <span className="tessel-logo">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="1" y="1" width="12" height="12" rx="5" />
        <rect x="15" y="1" width="12" height="12" rx="6" />
        <rect x="1" y="15" width="12" height="12" rx="6" />
        <rect x="15" y="15" width="12" height="12" rx="5" />
      </svg>
      Tessel
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Tessel"
      logo={<Logo />}
      current={current}
      settings="billing"
      logout="sign-up"
      user={{ name: people.ada.name, email: people.ada.email, src: people.ada.src }}
      main={[
        { id: 'overview', label: 'Overview', icon: <SquaresFour /> },
        { id: 'project', label: 'Projects', icon: <FolderSimple /> },
        { id: 'reports', label: 'Reports', icon: <ChartBar /> },
        { id: 'team', label: 'Team', icon: <UsersThree /> },
        { id: 'inbox', label: 'Inbox', icon: <Tray /> },
        { id: 'calendar', label: 'Calendar', icon: <CalendarBlank /> },
      ]}
      more={[
        { id: 'billing', label: 'Settings', icon: <Gear /> },
        { id: 'help', label: 'Help', icon: <Question /> },
      ]}
    >
      {children}
    </AppShell>
  );
}
