// Solin's screens, in the order the Examples page shows them.
import Home from './Home';
import Lobby from './Lobby';
import Missing from './Missing';
import Payouts from './Payouts';
import Product from './Product';

export const creators = {
  id: 'creators',
  name: 'Creators',
  host: 'solin.page',
  home: 'home',
  screens: [
    { id: 'home', name: 'Home: overview', file: 'Home.tsx', Screen: Home },
    { id: 'product', name: 'Create a product', file: 'Product.tsx', Screen: Product },
    { id: 'lobby', name: 'Join a call: lobby', file: 'Lobby.tsx', Screen: Lobby },
    { id: 'payouts', name: 'Payouts', file: 'Payouts.tsx', Screen: Payouts },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'data.ts', 'creators.css', 'shared/AppShell.tsx', 'shared/app.css', 'kit.tsx'],
};
