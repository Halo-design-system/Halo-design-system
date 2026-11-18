import figma from '@figma/code-connect';
import { Tooltip } from '@halo-ds/react';

figma.connect(Tooltip, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9842-32', {
  example: () => <Tooltip />,
});
