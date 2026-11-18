import figma from '@figma/code-connect';
import { Button, Result } from '@halo-ds/react';

figma.connect(Result, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10607-615', {
  props: {
    status: figma.enum('Status', {
      Success: 'success',
      Error: 'error',
      Warning: 'warning',
      Information: 'information',
      'Not found': 'not-found',
      'No access': 'no-access',
      'Server error': 'server-error',
      Offline: 'offline',
      Maintenance: 'maintenance',
    }),
    size: figma.enum('Size', { Medium: 'md', Small: 'sm' }),
    actions: figma.boolean('Show actions', { true: <Button>Back to overview</Button>, false: undefined }),
  },
  example: (props) => <Result title="Payment sent" description="We emailed a receipt to you and the person you paid." {...props} />,
});
