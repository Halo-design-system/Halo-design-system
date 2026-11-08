import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../Avatar';
import { Select, SelectField } from './Select';
import { ComboboxField } from './Combobox';
import type { SelectOption } from './Select';

const fruit: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape', disabled: true },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
];

const meta = {
  title: 'Components/Select',
  component: SelectField,
  subcomponents: { Select },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Picks one option from a known list. The trigger opens a listbox; arrow keys move, Enter chooses, and typing jumps to a match. Pass `name` to send the value with a form. For long lists or free text, use a Combobox.',
      },
    },
  },
  args: { label: 'Favourite fruit', hint: 'Pick the one you eat most.', options: fruit, size: 'md' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Sizes, an error and disabled. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Select aria-label="Small" size="sm" options={fruit} />
      <Select aria-label="Large" size="lg" options={fruit} defaultValue="mango" />
      <SelectField label="Fruit" options={fruit} error="Choose a fruit to continue." />
      <SelectField label="Fruit" options={fruit} defaultValue="pear" disabled />
    </div>
  ),
};

/** Type to filter, choose one. */
export const Combobox: Story = {
  render: () => <ComboboxField label="Fruit" options={fruit} placeholder="Search fruit" />,
};

/** Options with an avatar show it in the list and on the tag. */
export const ComboboxPeople: Story = {
  render: () => (
    <ComboboxField
      label="Assign to"
      multiple
      defaultValue={['Ada Obi', 'Lara Pinto']}
      options={['Ada Obi', 'Jonas Schmidt', 'Lara Pinto'].map((name) => ({ value: name, label: name, avatar: <Avatar size="xs" name={name} /> }))}
      placeholder="Choose people"
    />
  ),
};

/** Several values shown as Tags, plus adding new ones. Backspace removes the last tag. */
export const ComboboxMultiple: Story = {
  render: function Render() {
    const [options, setOptions] = useState(fruit);
    const [value, setValue] = useState(['apple', 'mango']);
    return (
      <ComboboxField
        label="Fruit"
        multiple
        options={options}
        value={value}
        onValueChange={setValue}
        onCreate={(text) => {
          const v = text.toLowerCase();
          setOptions([...options, { value: v, label: text }]);
          setValue([...value, v]);
        }}
      />
    );
  },
};
