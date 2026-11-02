// The frame around every Tessel screen: a sidebar on wide screens, a top bar with a menu on smaller ones.
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Avatar, CompactButton, Drawer, Menu, NavItem, Sidebar, TopBar } from '@halo-ds/react';
import { Bell, CalendarBlank, ChartBar, DotsThreeVertical, FolderSimple, Gear, MagnifyingGlass, Question, SquaresFour, Tray, UsersThree } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { people } from './data';
import './saas.css';

const main = [
  { id: 'overview', label: 'Overview', icon: <SquaresFour /> },
  { id: 'project', label: 'Projects', icon: <FolderSimple /> },
  { id: 'reports', label: 'Reports', icon: <ChartBar /> },
  { id: 'team', label: 'Team', icon: <UsersThree /> },
  { id: 'inbox', label: 'Inbox', icon: <Tray /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarBlank /> },
];
const more = [
  { id: 'billing', label: 'Settings', icon: <Gear /> },
  { id: 'help', label: 'Help', icon: <Question /> },
];

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

function User() {
  const go = useNav();
  return (
    <div className="tessel-user">
      <Avatar src={people.ada.src} name={people.ada.name} size="md" />
      <span className="tessel-user-text">
        <strong>{people.ada.name}</strong>
        <span>{people.ada.email}</span>
      </span>
      <Menu
        aria-label="Account"
        trigger={
          <CompactButton variant="ghost" aria-label="Account menu">
            <DotsThreeVertical />
          </CompactButton>
        }
        items={[
          { label: 'Settings', icon: <Gear />, onSelect: () => go('billing') },
          { type: 'separator' },
          { label: 'Log out', onSelect: () => go('sign-up') },
        ]}
      />
    </div>
  );
}

export function Shell({ current, children }: { current: string; children: ReactNode }) {
  const go = useNav();
  const [menu, setMenu] = useState(false);
  const item = (it: (typeof main)[number], close = false) => (
    <NavItem
      key={it.id}
      icon={it.icon}
      selected={current === it.id}
      onClick={() => {
        if (close) setMenu(false);
        go(it.id);
      }}
    >
      {it.label}
    </NavItem>
  );
  return (
    <div className="tessel">
      <Sidebar className="tessel-side" aria-label="Tessel" header={<Logo />} footer={<>{more.map((it) => item(it))}</>} user={<User />}>
        {main.map((it) => item(it))}
      </Sidebar>
      {/* Phones and tablets: menu and actions on top, the logo lives in the menu */}
      <TopBar
        className="tessel-top"
        aria-label="Tessel"
        onMenuClick={() => setMenu(true)}
        actions={
          <>
            <CompactButton variant="ghost" aria-label="Search">
              <MagnifyingGlass />
            </CompactButton>
            <CompactButton variant="ghost" aria-label="Notifications">
              <Bell />
            </CompactButton>
            <Avatar src={people.ada.src} name={people.ada.name} size="sm" />
          </>
        }
      />
      <Drawer open={menu} onClose={() => setMenu(false)} side="left" size="sm" title={<Logo />}>
        <nav className="tessel-drawer-nav" aria-label="Tessel">
          {main.map((it) => item(it, true))}
          {more.map((it) => item(it, true))}
        </nav>
      </Drawer>
      <main className="tessel-main">{children}</main>
    </div>
  );
}
