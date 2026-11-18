import figma from '@figma/code-connect';
import { ButtonGroup } from '@halo-ds/react';

figma.connect(ButtonGroup, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9916-367', {
  example: () => <ButtonGroup />,
});
