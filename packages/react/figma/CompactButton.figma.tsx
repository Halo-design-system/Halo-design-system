import figma from '@figma/code-connect';
import { CompactButton } from '@halo-ds/react';

figma.connect(CompactButton, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9739-1191', {
  props: {
    variant: figma.enum('Style', { Stroke: 'stroke', Ghost: 'ghost', Fill: 'fill' }),
    size: figma.enum('Size', { Large: 'lg', Medium: 'md' }),
    round: figma.enum('Full radius', { Yes: true }),
    selected: figma.enum('State', { Selected: true }),
    icon: figma.instance('Change icon'),
  },
  example: ({ icon, ...props }) => (
    <CompactButton aria-label="Describe the action" {...props}>
      {icon}
    </CompactButton>
  ),
});
