// Zephra's screens, in the order the Examples page shows them.
import Missing from './Missing';
import Overview from './Overview';
import Paid from './Paid';
import Receipts from './Receipts';
import Return from './Return';

export const tax = {
  id: 'tax',
  name: 'Tax',
  host: 'zephra.ng',
  home: 'overview',
  screens: [
    { id: 'overview', name: 'Home: overview', file: 'Overview.tsx', Screen: Overview },
    { id: 'return', name: 'File a return: deductions', file: 'Return.tsx', Screen: Return },
    { id: 'paid', name: 'Pay tax: receipt', file: 'Paid.tsx', Screen: Paid },
    { id: 'receipts', name: 'Receipts', file: 'Receipts.tsx', Screen: Receipts },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'data.ts', 'tax.css', 'shared/AppShell.tsx', 'shared/app.css', 'kit.tsx'],
};
