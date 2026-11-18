import figma from '@figma/code-connect';
import { EventCalendar } from '@halo-ds/react';

figma.connect(EventCalendar, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10535-667', {
  example: () => <EventCalendar />,
});
