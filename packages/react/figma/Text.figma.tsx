import figma from '@figma/code-connect';
import { Text } from '@halo-ds/react';

figma.connect(Text, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9823-53', {
  example: () => <Text />,
});
