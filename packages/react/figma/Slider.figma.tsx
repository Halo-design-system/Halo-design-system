import figma from '@figma/code-connect';
import { Slider } from '@halo-ds/react';

figma.connect(Slider, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10199-96', {
  example: () => <Slider />,
});

figma.connect(Slider, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10200-55', {
  example: () => <Slider />,
});
