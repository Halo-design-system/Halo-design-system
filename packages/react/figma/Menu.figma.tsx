import figma from '@figma/code-connect';
import { Menu } from '@halo-ds/react';

figma.connect(Menu, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10071-72', {
  example: () => <Menu />,
});
