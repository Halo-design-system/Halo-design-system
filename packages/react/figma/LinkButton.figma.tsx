import figma from '@figma/code-connect';
import { LinkButton } from '@halo-ds/react';

figma.connect(LinkButton, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9792-2301', {
  example: () => <LinkButton />,
});
