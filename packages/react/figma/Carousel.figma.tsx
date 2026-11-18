import figma from '@figma/code-connect';
import { Carousel } from '@halo-ds/react';

figma.connect(Carousel, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10356-108', {
  example: () => <Carousel />,
});
