// Tessel's screens, in the order the Examples page shows them.
import Billing from './Billing';
import Missing from './Missing';
import ProjectBoard from './Board';
import Overview from './Overview';
import SignUp from './SignUp';
import TaskDetail from './TaskDetail';

export const saas = {
  id: 'saas',
  name: 'SaaS',
  host: 'app.tessel.io',
  home: 'overview',
  screens: [
    { id: 'overview', name: 'Home: overview', file: 'Overview.tsx', Screen: Overview },
    { id: 'project', name: 'Project board', file: 'Board.tsx', Screen: ProjectBoard },
    { id: 'task', name: 'Task detail (drawer)', file: 'Board.tsx', Screen: TaskDetail },
    { id: 'billing', name: 'Billing', file: 'Billing.tsx', Screen: Billing },
    { id: 'sign-up', name: 'Sign up', file: 'SignUp.tsx', Screen: SignUp },
  ],
  Missing,
  /** Shared by every screen, shown under Code after the screen's own file. */
  shared: ['Shell.tsx', 'data.ts', 'saas.css'],
};
