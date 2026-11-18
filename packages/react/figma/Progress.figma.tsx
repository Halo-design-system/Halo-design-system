import figma from '@figma/code-connect';
import { ProgressBar, ProgressCircle } from '@halo-ds/react';

figma.connect(ProgressBar, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10224-28', {
  example: () => <ProgressBar />,
});

figma.connect(ProgressCircle, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10224-103', {
  example: () => <ProgressCircle />,
});

figma.connect(ProgressBar, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10224-1004', {
  example: () => <ProgressBar />,
});
