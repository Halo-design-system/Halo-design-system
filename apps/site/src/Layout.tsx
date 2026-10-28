import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CompactButton, Drawer, NavItem, TopBar, Tooltip } from '@halo-ds/react';
import { GithubLogo, Moon, Sun } from '@phosphor-icons/react';
import { Link, links, useRoute } from './router';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Halo, home">
      {/* The Halo mark from Figma (Logo component): three rings, the bottom one follows the theme */}
      <svg width="24" height="24" viewBox="0 -0.9 40 40" aria-hidden="true">
        <path fill="var(--halo-color-purple-200)" fillRule="evenodd" d="M40 6.66667C40 10.3486 31.0457 13.3333 20 13.3333C8.9543 13.3333 0 10.3486 0 6.66667C0 2.98477 8.9543 0 20 0C31.0457 0 40 2.98477 40 6.66667ZM4.4 6.66667C4.4 9.53855 11.3844 11.8667 20 11.8667C28.6156 11.8667 35.6 9.53855 35.6 6.66667C35.6 3.79479 28.6156 1.46667 20 1.46667C11.3844 1.46667 4.4 3.79479 4.4 6.66667Z" />
        <path fill="var(--halo-color-purple-600)" fillRule="evenodd" d="M40 19.1111C40 22.793 31.0457 25.7778 20 25.7778C8.9543 25.7778 0 22.793 0 19.1111C0 15.4292 8.9543 12.4444 20 12.4444C31.0457 12.4444 40 15.4292 40 19.1111ZM4.4 19.1111C4.4 21.983 11.3844 24.3111 20 24.3111C28.6156 24.3111 35.6 21.983 35.6 19.1111C35.6 16.2392 28.6156 13.9111 20 13.9111C11.3844 13.9111 4.4 16.2392 4.4 19.1111Z" />
        <path fill="var(--halo-icon-primary)" fillRule="evenodd" d="M40 31.5556C40 35.2375 31.0457 38.2222 20 38.2222C8.9543 38.2222 0 35.2375 0 31.5556C0 27.8737 8.9543 24.8889 20 24.8889C31.0457 24.8889 40 27.8737 40 31.5556ZM4.4 31.5556C4.4 34.4274 11.3844 36.7556 20 36.7556C28.6156 36.7556 35.6 34.4274 35.6 31.5556C35.6 28.6837 28.6156 26.3556 20 26.3556C11.3844 26.3556 4.4 28.6837 4.4 31.5556Z" />
      </svg>
      <span>Halo</span>
    </Link>
  );
}

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('halo-site-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Storage can be blocked; fall back to the system setting
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('halo-site-theme', theme);
    } catch {
      // Not saved; the choice still applies for this visit
    }
  }, [theme]);
  return [theme, setTheme] as const;
}

const pages = [
  { to: '/components', label: 'Components' },
  { to: '/examples', label: 'Examples' },
  { to: '/figma', label: 'Figma' },
  { to: '/docs', label: 'Docs' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { path, go } = useRoute();
  const [theme, setTheme] = useTheme();
  const [menu, setMenu] = useState(false);
  const isOn = (to: string) => path === to || path.startsWith(to + '/');

  const actions = (
    <>
      <Tooltip content="GitHub">
        <CompactButton variant="ghost" aria-label="GitHub" onClick={() => window.open(links.github, '_blank', 'noopener')}>
          <GithubLogo />
        </CompactButton>
      </Tooltip>
      <Tooltip content={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
        <CompactButton variant="ghost" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </CompactButton>
      </Tooltip>
    </>
  );

  return (
    <div className="site">
      <a className="skip" href="#main">Skip to content</a>
      <TopBar className="site-bar" logo={<Logo />} actions={actions} onMenuClick={() => setMenu(true)}>
        {pages.map((p) => (
          <NavItem key={p.to} href={import.meta.env.BASE_URL.replace(/\/$/, '') + p.to} selected={isOn(p.to)} onClick={(e) => { e.preventDefault(); go(p.to); }}>
            {p.label}
          </NavItem>
        ))}
        <NavItem href={links.storybook}>Storybook</NavItem>
      </TopBar>
      <Drawer open={menu} onClose={() => setMenu(false)} side="left" size="sm" title={<Logo />}>
        <nav aria-label="Main" className="drawer-nav">
          {pages.map((p) => (
            <NavItem key={p.to} selected={isOn(p.to)} onClick={() => { setMenu(false); go(p.to); }}>
              {p.label}
            </NavItem>
          ))}
          <NavItem href={links.storybook}>Storybook</NavItem>
          <NavItem href={links.github}>GitHub</NavItem>
        </nav>
      </Drawer>
      <main id="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <Logo />
          <p>Open source under the MIT licence. Built with its own components.</p>
          <nav aria-label="Footer" className="footer-links">
            <a href={links.github}>GitHub</a>
            <a href={links.npm}>npm</a>
            <a href={links.storybook}>Storybook</a>
            <Link to="/figma">Figma</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
