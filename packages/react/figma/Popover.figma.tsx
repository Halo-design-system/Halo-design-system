import figma from '@figma/code-connect';
import { Popover } from '@halo-ds/react';

figma.connect(Popover, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10218-187', {
  example: () => <Popover />,
});
