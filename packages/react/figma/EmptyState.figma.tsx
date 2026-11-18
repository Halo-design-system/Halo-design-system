import figma from '@figma/code-connect';
import { EmptyState } from '@halo-ds/react';

figma.connect(EmptyState, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10019-74', {
  example: () => <EmptyState />,
});
