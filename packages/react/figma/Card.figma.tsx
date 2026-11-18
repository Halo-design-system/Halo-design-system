import figma from '@figma/code-connect';
import { Card } from '@halo-ds/react';

figma.connect(Card, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9925-73', {
  example: () => <Card />,
});
