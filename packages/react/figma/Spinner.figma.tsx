import figma from '@figma/code-connect';
import { LoadingIndicator, Spinner } from '@halo-ds/react';

figma.connect(Spinner, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10206-64', {
  example: () => <Spinner />,
});

figma.connect(LoadingIndicator, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10207-28', {
  example: () => <LoadingIndicator />,
});
