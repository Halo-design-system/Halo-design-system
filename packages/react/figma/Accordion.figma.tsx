import figma from '@figma/code-connect';
import { AccordionItem } from '@halo-ds/react';

figma.connect(AccordionItem, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9815-16', {
  example: () => <AccordionItem />,
});
