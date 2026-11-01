import type { Meta, StoryObj } from '@storybook/react-vite';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input, InputField, PasswordInput } from './Input';
import { NumberInput } from './NumberInput';
import { VerificationCode } from './VerificationCode';

const meta = {
  title: 'Components/Input',
  component: InputField,
  subcomponents: { Input, PasswordInput, NumberInput, VerificationCode },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-line text box. `InputField` adds a label, a hint and an error message, wired to the input for screen readers. Use `Input` on its own only where a label is nearby. Icons, prefixes and suffixes cover search, website, amount and phone inputs; `PasswordInput`, `NumberInput` and `VerificationCode` cover the special cases.',
      },
    },
  },
  args: { label: 'Email', placeholder: 'name@example.com', hint: 'We never share your email.', size: 'md' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Small, Medium and Large. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="md" placeholder="Medium" aria-label="Medium" />
      <Input size="lg" placeholder="Large" aria-label="Large" />
    </div>
  ),
};

/** Required, optional, an info tip, success, an error and disabled. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <InputField label="Full name" placeholder="John Doe" required defaultValue="Amara Okafor" />
      <InputField label="Company" optional info="Shown on your invoices." placeholder="Studio" />
      <InputField label="Username" placeholder="johndoe" valid defaultValue="amara.okafor" />
      <InputField label="Password" placeholder="••••••••" error="Use at least 8 characters." defaultValue="abc" />
      <InputField label="Email" placeholder="johndoe@example.com" disabled defaultValue="amara@example.com" />
    </div>
  ),
};

/** After a value passes a check: a green check at the end of the box, with no message and no colour change. Use `valid`. An error always wins and shows a red warning icon. */
export const Success: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <InputField label="Username" placeholder="johndoe" valid defaultValue="amara.okafor" />
      <InputField label="Account number" placeholder="0000000000" hint="10 digits" valid defaultValue="0123456789" />
      <Input valid placeholder="Promo code" defaultValue="SAVE20" aria-label="Promo code" />
    </div>
  ),
};

/** Icons, prefixes and suffixes. */
export const Affixes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Input iconLeft={<MagnifyingGlass />} placeholder="Search" aria-label="Search" />
      <InputField label="Website" prefix="https://" placeholder="example.com" />
      <InputField label="Weight" suffix="kg" placeholder="70" defaultValue="72" />
      <PasswordInput label="Password" defaultValue="correct horse" />
    </div>
  ),
};

/** A number with minus and plus buttons. */
export const Number: Story = {
  render: () => <NumberInput label="Guests" placeholder="1" defaultValue={2} min={1} max={10} />,
};

/** One circle per digit. Pasting fills them all. */
export const Code: Story = {
  render: () => <VerificationCode length={6} defaultValue="482" />,
};
