import figma from '@figma/code-connect';
import { Overlay } from '@halo-ds/react';

figma.connect(Overlay, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9957-107', {
  example: () => <Overlay />,
});
