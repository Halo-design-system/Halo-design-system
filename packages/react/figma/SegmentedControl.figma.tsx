import figma from '@figma/code-connect';
import { SegmentedControl } from '@halo-ds/react';

figma.connect(SegmentedControl, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10238-28210', {
  example: () => <SegmentedControl />,
});
