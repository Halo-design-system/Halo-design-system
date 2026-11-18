import figma from '@figma/code-connect';
import { FieldLabel } from '@halo-ds/react';

figma.connect(FieldLabel, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10048-681', {
  example: () => <FieldLabel />,
});
