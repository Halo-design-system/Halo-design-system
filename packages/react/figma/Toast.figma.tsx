import figma from '@figma/code-connect';
import { Toast } from '@halo-ds/react';

figma.connect(Toast, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9990-219', {
  example: () => <Toast />,
});
