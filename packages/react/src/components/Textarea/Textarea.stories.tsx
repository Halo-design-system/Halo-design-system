import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea, TextareaField } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: TextareaField,
  subcomponents: { Textarea },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A multi-line text box for feedback, bios and messages. Set `maxLength` to show a count. People can type past the limit in some products; here the browser stops them at it.',
      },
    },
  },
  args: { label: 'Feedback', placeholder: 'Tell us what you think', hint: 'We read every message.', maxLength: 280 },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Error and disabled. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <TextareaField label="Bio" placeholder="A sentence or two about you" error="Add a few words about yourself." />
      <TextareaField label="Notes" placeholder="Anything we should know" disabled defaultValue="Read only for now." />
    </div>
  ),
};
