// Veyra's screens, in the order the Examples page shows them.
import AddDeal from './AddDeal';
import Contacts from './Contacts';
import Dashboard from './Dashboard';
import Deal from './Deal';
import Missing from './Missing';
import Pipeline from './Pipeline';

export const salesCrm = {
  id: 'sales-crm',
  name: 'Sales CRM',
  host: 'veyra.io',
  home: 'dashboard',
  screens: [
    { id: 'dashboard', name: 'Home: overview', file: 'Dashboard.tsx', Screen: Dashboard },
    { id: 'deal', name: 'Deal detail', file: 'Deal.tsx', Screen: Deal },
    { id: 'contacts', name: 'Contacts', file: 'Contacts.tsx', Screen: Contacts },
    { id: 'add-deal', name: 'Add a deal (drawer)', file: 'Pipeline.tsx', Screen: AddDeal },
    { id: 'pipeline', name: 'Deals board', file: 'Pipeline.tsx', Screen: Pipeline },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'DealCard.tsx', 'data.ts', 'crm.css', 'shared/AppShell.tsx', 'shared/app.css', 'kit.tsx'],
};
