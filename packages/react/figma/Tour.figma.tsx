import figma from '@figma/code-connect';
import { Tour } from '@halo-ds/react';

figma.connect(Tour, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10529-940', {
  example: () => <Tour />,
});
