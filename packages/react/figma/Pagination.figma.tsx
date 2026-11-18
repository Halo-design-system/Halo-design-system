import figma from '@figma/code-connect';
import { Pagination } from '@halo-ds/react';

figma.connect(Pagination, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10163-6623', {
  example: () => <Pagination />,
});
