import figma from '@figma/code-connect';
import { Button } from '@halo-ds/react';

figma.connect(Button, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9697-2459', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Type', { Primary: 'primary', Secondary: 'secondary', Ghost: 'ghost', Destructive: 'destructive', Premium: 'premium' }),
    size: figma.enum('Size', { 'X small': 'xs', Small: 'sm', Medium: 'md', Large: 'lg' }),
    loading: figma.enum('State', { Loading: true }),
    disabled: figma.enum('State', { Disabled: true }),
    iconLeft: figma.boolean('L icon', { true: figma.instance('Change L icon'), false: undefined }),
    iconRight: figma.boolean('R icon', { true: figma.instance('Change R icon'), false: undefined }),
  },
  variant: { 'Icon only': 'Off' },
  example: ({ label, ...props }) => <Button {...props}>{label}</Button>,
});

figma.connect(Button, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9697-2459', {
  props: {
    variant: figma.enum('Type', { Primary: 'primary', Secondary: 'secondary', Ghost: 'ghost', Destructive: 'destructive', Premium: 'premium' }),
    size: figma.enum('Size', { 'X small': 'xs', Small: 'sm', Medium: 'md', Large: 'lg' }),
    icon: figma.instance('Change L icon'),
  },
  variant: { 'Icon only': 'On' },
  example: ({ icon, ...props }) => (
    <Button iconOnly aria-label="Describe the action" {...props}>
      {icon}
    </Button>
  ),
});
