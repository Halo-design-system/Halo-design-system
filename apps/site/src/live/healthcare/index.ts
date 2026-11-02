// Nimbo's screens, in the order the Examples page shows them.
import Billing from './Billing';
import Missing from './Missing';
import Patient from './Patient';
import Prescribe from './Prescribe';
import Today from './Today';

export const healthcare = {
  id: 'healthcare',
  name: 'Healthcare',
  host: 'nimbo.health',
  home: 'today',
  screens: [
    { id: 'today', name: 'Home: overview', file: 'Today.tsx', Screen: Today },
    { id: 'patient', name: 'Patient record', file: 'Patient.tsx', Screen: Patient },
    { id: 'prescribe', name: 'Prescribe', file: 'Prescribe.tsx', Screen: Prescribe },
    { id: 'billing', name: 'Billing', file: 'Billing.tsx', Screen: Billing },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'data.ts', 'shared/AppShell.tsx', 'shared/app.css', 'kit.tsx'],
};
