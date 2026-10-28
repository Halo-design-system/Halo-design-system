import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Halo Design System',
    brandImage: 'logo.svg',
    brandUrl: 'https://github.com/Halo-design-system/Halo-design-system',
    colorPrimary: '#CC1DD0',
    colorSecondary: '#8C148F',
  }),
});
