import figma from '@figma/code-connect';
import { Drawer } from '@halo-ds/react';

figma.connect(Drawer, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9965-212', {
  example: () => <Drawer />,
});
