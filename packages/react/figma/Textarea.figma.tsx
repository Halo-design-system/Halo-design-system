import figma from '@figma/code-connect';
import { Textarea, TextareaField } from '@halo-ds/react';

figma.connect(Textarea, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10126-319', {
  props: {
    placeholder: figma.string('Placeholder'),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    invalid: figma.enum('State', { Error: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  variant: { Content: 'Placeholder' },
  example: (props) => <Textarea {...props} />,
});

figma.connect(Textarea, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10126-319', {
  props: {
    defaultValue: figma.string('Value'),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    invalid: figma.enum('State', { Error: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  variant: { Content: 'Filled' },
  example: (props) => <Textarea {...props} />,
});

figma.connect(TextareaField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10126-470', {
  example: () => <TextareaField />,
});
