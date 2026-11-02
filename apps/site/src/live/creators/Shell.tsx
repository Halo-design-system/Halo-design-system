// Solin's frame: its logo, menu and signed-in person, in the shared app layout.
import type { ReactNode } from 'react';
import { Cube, FilmSlate, Gear, Phone, Question, SquaresFour, UsersThree, Wallet } from '@phosphor-icons/react';
import { AppShell } from '../shared/AppShell';
import { me } from './data';
import './creators.css';

export function Logo() {
  return (
    <span className="solin-logo">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="15" />
        <circle cx="19" cy="11" r="6" className="solin-logo-hole" />
      </svg>
      Solin
    </span>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <AppShell
      name="Solin"
      logo={<Logo />}
      current={current}
      settings="settings"
      logout="home"
      user={me}
      main={[
        { id: 'home', label: 'Home', icon: <SquaresFour /> },
        { id: 'calls', label: 'Calls', icon: <Phone /> },
        { id: 'webinars', label: 'Webinars', icon: <FilmSlate /> },
        { id: 'product', label: 'Products', icon: <Cube /> },
        { id: 'customers', label: 'Customers', icon: <UsersThree /> },
        { id: 'payouts', label: 'Payouts', icon: <Wallet /> },
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
