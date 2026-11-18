import figma from '@figma/code-connect';
import { Rating } from '@halo-ds/react';

figma.connect(Rating, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10354-627', {
  example: () => <Rating />,
});
