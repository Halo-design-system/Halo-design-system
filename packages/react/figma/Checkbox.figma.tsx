import figma from '@figma/code-connect';
import { Checkbox, CheckboxGroup } from '@halo-ds/react';

figma.connect(Checkbox, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9935-66', {
  example: () => <Checkbox />,
});

figma.connect(Checkbox, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9936-40', {
  example: () => <Checkbox />,
});

figma.connect(CheckboxGroup, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9936-87', {
  example: () => <CheckboxGroup />,
});
