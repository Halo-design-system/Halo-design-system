import figma from '@figma/code-connect';
import { Badge } from '@halo-ds/react';

figma.connect(Badge, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9883-286', {
  props: {
    label: figma.string('Label'),
    color: figma.enum('Colour', { Neutral: 'neutral', Brand: 'brand', Information: 'information', Success: 'success', Warning: 'warning', Error: 'error' }),
    variant: figma.enum('Style', { Soft: 'soft', Solid: 'solid', Outline: 'outline' }),
    size: figma.enum('Size', { 'X small': 'xs', Small: 'sm', Medium: 'md', Large: 'lg' }),
    dot: figma.boolean('Show dot'),
    icon: figma.boolean('L icon', { true: figma.instance('Change L icon'), false: undefined }),
  },
  example: ({ label, ...props }) => <Badge {...props}>{label}</Badge>,
});
