import figma from '@figma/code-connect';
import { Radio, RadioGroup } from '@halo-ds/react';

figma.connect(Radio, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10150-46', {
  example: () => <Radio />,
});

figma.connect(Radio, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10150-415', {
  example: () => <Radio />,
});

figma.connect(RadioGroup, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10150-1398', {
  example: () => <RadioGroup />,
});
