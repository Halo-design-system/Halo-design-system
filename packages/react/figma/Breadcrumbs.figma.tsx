import figma from '@figma/code-connect';
import { Breadcrumbs } from '@halo-ds/react';

figma.connect(Breadcrumbs, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9903-7409', {
  example: () => <Breadcrumbs />,
});
