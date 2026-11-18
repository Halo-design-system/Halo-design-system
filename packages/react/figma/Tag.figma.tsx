import figma from '@figma/code-connect';
import { Tag } from '@halo-ds/react';

figma.connect(Tag, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10095-221', {
  props: {
    label: figma.string('Label'),
    color: figma.enum('Colour', { Neutral: 'neutral', Blue: 'blue', Green: 'green', Yellow: 'yellow', Orange: 'orange', Red: 'red', Pink: 'pink', Purple: 'purple' }),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md' }),
    disabled: figma.enum('State', { Disabled: true }),
    icon: figma.boolean('L icon', { true: figma.instance('Change L icon'), false: undefined }),
    onRemove: figma.boolean('Closable', { true: () => {}, false: undefined }),
  },
  example: ({ label, ...props }) => <Tag {...props}>{label}</Tag>,
});
