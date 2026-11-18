import figma from '@figma/code-connect';
import { List, ListItem } from '@halo-ds/react';

figma.connect(ListItem, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10033-136', {
  example: () => <ListItem />,
});

figma.connect(List, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10034-328', {
  example: () => <List />,
});
