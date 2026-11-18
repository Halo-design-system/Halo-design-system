import figma from '@figma/code-connect';
import { Tab, Tabs } from '@halo-ds/react';

figma.connect(Tab, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10174-217', {
  example: () => <Tab />,
});

figma.connect(Tabs, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10179-23875', {
  example: () => <Tabs />,
});
