import type { Meta, StoryObj } from '@storybook/react-vite';
import { Overlay } from './Overlay';

const meta = {
  title: 'Components/Overlay',
  component: Overlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Covers the page behind a Modal or Drawer. Modal and Drawer use it for you; use it on its own only for custom panels.',
      },
      story: { inline: false, iframeHeight: 320 },
    },
  },
  args: { variant: 'blur', position: 'center' },
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ height: 320, padding: 24, fontFamily: 'var(--halo-font-family-body)', color: 'var(--halo-text-primary)' }}>
      Page content behind the overlay.
      <Overlay {...args}>
        <div style={{ padding: 24, borderRadius: 16, background: 'var(--halo-surface-primary)' }}>Content on top</div>
      </Overlay>
    </div>
  ),
};
