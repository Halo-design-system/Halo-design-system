import figma from '@figma/code-connect';
import { QRCode } from '@halo-ds/react';

figma.connect(QRCode, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10525-100', {
  example: () => <QRCode />,
});
