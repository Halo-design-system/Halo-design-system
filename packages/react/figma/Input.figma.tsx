import figma from '@figma/code-connect';
import { Input, InputField, NumberInput, VerificationCode } from '@halo-ds/react';

figma.connect(Input, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10039-320', {
  props: {
    placeholder: figma.string('Placeholder'),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    invalid: figma.enum('State', { Error: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  variant: { Content: 'Placeholder' },
  example: (props) => <Input {...props} />,
});

figma.connect(Input, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10039-320', {
  props: {
    value: figma.string('Value'),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    invalid: figma.enum('State', { Error: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  variant: { Content: 'Filled' },
  example: (props) => <Input {...props} onChange={() => {}} />,
});

figma.connect(InputField, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10040-136', {
  props: {
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    error: figma.enum('State', { Error: 'Explain what went wrong.' }),
    valid: figma.enum('State', { Success: true }),
    disabled: figma.enum('State', { Disabled: true }),
    hint: figma.boolean('Hint', { true: 'Hint text', false: undefined }),
  },
  example: (props) => <InputField label="Label" placeholder="Placeholder" {...props} />,
});

figma.connect(NumberInput, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10044-14610', {
  example: () => <NumberInput />,
});

figma.connect(VerificationCode, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10047-637', {
  example: () => <VerificationCode />,
});
