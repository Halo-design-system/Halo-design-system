import figma from '@figma/code-connect';
import { TimePicker, TimePickerField } from '@halo-ds/react';

figma.connect(TimePicker, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10351-336', {
  example: () => <TimePicker />,
});

figma.connect(TimePickerField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10351-589', {
  example: () => <TimePickerField />,
});
