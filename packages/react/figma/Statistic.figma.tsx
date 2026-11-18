import figma from '@figma/code-connect';
import { Statistic } from '@halo-ds/react';

figma.connect(Statistic, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10605-167', {
  props: {
    value: figma.string('Value'),
    size: figma.enum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' }),
    trend: figma.enum('Trend', { Up: 'up', Down: 'down', Flat: 'flat' }),
    showChange: figma.boolean('Show change'),
  },
  example: ({ showChange, ...props }) =>
    showChange ? (
      <Statistic label="Active users" change="+12.4%" comparison="vs last month" {...props} />
    ) : (
      <Statistic label="Active users" {...props} />
    ),
});
