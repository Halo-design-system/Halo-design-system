import figma from '@figma/code-connect';
import { Divider } from '@halo-ds/react';

figma.connect(Divider, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10006-47', {
  example: () => <Divider />,
});
