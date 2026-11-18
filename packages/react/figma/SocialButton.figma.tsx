import figma from '@figma/code-connect';
import { SocialButton } from '@halo-ds/react';

figma.connect(SocialButton, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9760-2787', {
  example: () => <SocialButton />,
});
