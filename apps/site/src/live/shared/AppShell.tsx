// The frame every example app shares: a sidebar on wide screens, a top bar with a menu on smaller ones.
// Each app passes its own logo, menu and signed-in person.
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Avatar, CompactButton, Drawer, Menu, NavItem, Sidebar, TopBar } from '@halo-ds/react';
import { Bell, DotsThreeVertical, Gear, MagnifyingGlass } from '@phosphor-icons/react';
import { useNav } from '../kit';
import './app.css';

export interface NavLink {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface AppShellProps {
  name: string;
  logo: ReactNode;
  main: NavLink[];
  more: NavLink[];
  user: { name: string; email: string; src: string };
  /** The screen to open from the account menu's Settings, and when logging out. */
  settings: string;
  logout: string;
  current: string;
  children: ReactNode;
}

function User({ user, settings, logout }: Pick<AppShellProps, 'user' | 'settings' | 'logout'>) {
  const go = useNav();
  return (
    <div className="la-user">
      <Avatar src={user.src} name={user.name} size="md" />
      <span className="la-user-text">
        <span>{user.name}</span>
        <span>{user.email}</span>
      </span>
      <Menu
        aria-label="Account"
        trigger={
          <CompactButton variant="ghost" aria-label="Account menu">
            <DotsThreeVertical />
          </CompactButton>
        }
        items={[
          { label: 'Settings', icon: <Gear />, onSelect: () => go(settings) },
          { type: 'separator' },
          { label: 'Log out', onSelect: () => go(logout) },
        ]}
      />
    </div>
  );
}

export function AppShell({ name, logo, main, more, user, settings, logout, current, children }: AppShellProps) {
  const go = useNav();
  const [menu, setMenu] = useState(false);
  const item = (it: NavLink, close = false) => (
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
    <div className="la">
      <Sidebar className="la-side" aria-label={name} header={logo} footer={<>{more.map((it) => item(it))}</>} user={<User user={user} settings={settings} logout={logout} />}>
        {main.map((it) => item(it))}
      </Sidebar>
      {/* Phones and tablets: menu and actions on top, the logo lives in the menu */}
      <TopBar
        className="la-top"
        aria-label={name}
        onMenuClick={() => setMenu(true)}
        actions={
          <>
            <CompactButton variant="ghost" aria-label="Search">
              <MagnifyingGlass />
            </CompactButton>
            <CompactButton variant="ghost" aria-label="Notifications">
              <Bell />
            </CompactButton>
            <Avatar src={user.src} name={user.name} size="sm" />
          </>
        }
      />
      <Drawer open={menu} onClose={() => setMenu(false)} side="left" size="sm" title={logo}>
        <nav className="la-drawer-nav" aria-label={name}>
          {main.map((it) => item(it, true))}
          {more.map((it) => item(it, true))}
        </nav>
      </Drawer>
      <main className="la-main">{children}</main>
    </div>
  );
}
