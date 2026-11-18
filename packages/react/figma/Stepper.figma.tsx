import figma from '@figma/code-connect';
import { Stepper } from '@halo-ds/react';

figma.connect(Stepper, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10212-296', {
  example: () => <Stepper />,
});
