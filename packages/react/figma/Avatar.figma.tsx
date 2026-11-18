import figma from '@figma/code-connect';
import { Avatar, AvatarGroup, AvatarStatus } from '@halo-ds/react';

figma.connect(Avatar, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9848-261', {
  example: () => <Avatar />,
});

figma.connect(AvatarStatus, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9853-131', {
  example: () => <AvatarStatus />,
});

figma.connect(AvatarGroup, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=9854-411', {
  example: () => <AvatarGroup />,
});
