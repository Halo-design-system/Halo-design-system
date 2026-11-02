// Arko's screens, in the order the Examples page shows them.
import Missing from './Missing';
import Overview from './Overview';
import Payslip from './Payslip';
import Run from './Run';
import TimeOff from './TimeOff';

export const payroll = {
  id: 'payroll',
  name: 'Payroll',
  host: 'arkopay.co',
  home: 'overview',
  screens: [
    { id: 'overview', name: 'Home: overview', file: 'Overview.tsx', Screen: Overview },
    { id: 'run', name: 'Run payroll: review', file: 'Run.tsx', Screen: Run },
    { id: 'time-off', name: 'Time off: calendar', file: 'TimeOff.tsx', Screen: TimeOff },
    { id: 'payslip', name: 'Payslip', file: 'Payslip.tsx', Screen: Payslip },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'data.ts', 'payroll.css', 'shared/AppShell.tsx', 'shared/app.css', 'kit.tsx'],
};
