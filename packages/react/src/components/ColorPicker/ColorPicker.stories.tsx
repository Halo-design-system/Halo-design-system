import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorField, ColorPicker, ColorSwatch } from './ColorPicker';

const swatches = ['#CC1DD0', '#3D7BF7', '#1FA971', '#F5A524', '#E5484D', '#111827', '#9CA3AF', '#FFFFFF'];

const meta = {
  title: 'Components/Color picker',
  component: ColorPicker,
  subcomponents: { ColorField, ColorSwatch },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Picks a colour by dragging, typing or choosing a swatch. The shade area works with arrow keys (Shift for bigger steps), and hue and opacity are real range inputs. The eyedropper shows only where the browser supports it. `ColorField` puts a swatch and hex value in a field that opens the picker.',
      },
    },
  },
  args: { defaultValue: '#CC1DD0', showOpacity: true, showEyedropper: true, swatches },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [hex, setHex] = useState(args.defaultValue ?? '#CC1DD0');
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <ColorPicker {...args} value={hex} onValueChange={setHex} />
        <code>{hex}</code>
      </div>
    );
  },
};

/** A field that opens the picker. */
export const Field: Story = {
  render: () => (
    <div style={{ maxWidth: 240, minHeight: 420 }}>
      <ColorField label="Brand colour" placeholder="#2F6BFF" hint="Used for buttons and links." swatches={swatches} />
    </div>
  ),
};


/** Swatch shapes, sizes and selection. */
export const Swatches: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ColorSwatch color="#CC1DD0" aria-label="Purple" selected />
      <ColorSwatch color="#3D7BF7" aria-label="Blue" />
      <ColorSwatch color="#1FA971" aria-label="Green" shape="circle" />
      <ColorSwatch color="#E5484D80" aria-label="Red at half opacity" size="sm" />
    </div>
  ),
};
