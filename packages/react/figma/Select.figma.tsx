import figma from '@figma/code-connect';
import { Combobox, Select, SelectField } from '@halo-ds/react';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
];

figma.connect(Select, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10080-232', {
  example: () => <Select />,
});

figma.connect(SelectField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10080-16127', {
  example: () => <SelectField />,
});

figma.connect(Combobox, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10101-3233', {
  props: {
    placeholder: figma.string('Placeholder'),
    multiple: figma.enum('Type', { Multiple: true }),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    invalid: figma.enum('State', { Error: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: (props) => <Combobox options={options} {...props} />,
});
