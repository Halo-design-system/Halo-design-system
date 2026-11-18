import figma from '@figma/code-connect';
import { Skeleton } from '@halo-ds/react';

figma.connect(Skeleton, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10194-19', {
  example: () => <Skeleton />,
});
