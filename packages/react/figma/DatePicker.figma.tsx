import figma from '@figma/code-connect';
import { Calendar, DatePicker, DatePickerField, DateRangePicker, DateRangePickerField, MultiDatePicker, MultiDatePickerField } from '@halo-ds/react';

figma.connect(Calendar, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10142-375', {
  example: () => <Calendar />,
});

figma.connect(DatePicker, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10348-30143', {
  example: () => <DatePicker />,
});

figma.connect(DateRangePicker, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10348-30396', {
  example: () => <DateRangePicker />,
});

figma.connect(MultiDatePicker, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10542-86997', {
  example: () => <MultiDatePicker />,
});

figma.connect(DatePickerField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10348-30649', {
  example: () => <DatePickerField />,
});

figma.connect(DateRangePickerField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10348-30842', {
  example: () => <DateRangePickerField />,
});

figma.connect(MultiDatePickerField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10542-87310', {
  example: () => <MultiDatePickerField />,
});
