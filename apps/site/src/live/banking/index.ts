// Kova's screens, in the order the Examples page shows them.
import Cards from './Cards';
import Goal from './Goal';
import Home from './Home';
import Missing from './Missing';
import Send from './Send';

export const banking = {
  id: 'banking',
  name: 'Banking',
  host: 'kova.app',
  home: 'home',
  screens: [
    { id: 'home', name: 'Home: overview', file: 'Home.tsx', Screen: Home },
    { id: 'send', name: 'Send money', file: 'Send.tsx', Screen: Send },
    { id: 'cards', name: 'Card controls', file: 'Cards.tsx', Screen: Cards },
    { id: 'goal', name: 'Savings: goal detail', file: 'Goal.tsx', Screen: Goal },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'data.ts', 'banking.css', 'shared/AppShell.tsx', 'shared/app.css', 'kit.tsx'],
};
