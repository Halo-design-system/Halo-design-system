import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { InputField } from '../Input';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A dialog that blocks the page until people respond. Focus moves into it and stays inside, Escape or the overlay closes it, and focus returns to the button that opened it. Keep it short: a title that asks the question, one line of context and clear buttons. Destructive modals use `role="alertdialog"`.',
      },
    },
  },
  args: { open: false, onClose: () => {}, title: 'Save changes?', description: 'Your edits will be lost if you leave without saving.' },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={close}
          actions={
            <>
              <Button variant="secondary" onClick={close}>Discard</Button>
              <Button onClick={close}>Save</Button>
            </>
          }
        />
      </>
    );
  },
};

/** Red icon and button, stacked full-width buttons. */
export const Destructive: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>Delete project</Button>
        <Modal
          open={open}
          onClose={close}
          type="destructive"
          layout="stacked"
          title="Delete project?"
          description="This removes all files for everyone. You can't undo it."
          actions={
            <>
              <Button variant="destructive" onClick={close}>Delete</Button>
              <Button variant="secondary" onClick={close}>Cancel</Button>
            </>
          }
        />
      </>
    );
  },
};

/** A form in the content area. The field gets focus first via `data-autofocus`. */
export const WithContent: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Rename</Button>
        <Modal
          open={open}
          onClose={close}
          icon={false}
          title="Rename file"
          actions={
            <>
              <Button variant="secondary" onClick={close}>Cancel</Button>
              <Button onClick={close}>Rename</Button>
            </>
          }
        >
          <InputField label="Name" placeholder="Untitled report" defaultValue="Quarterly report" data-autofocus />
        </Modal>
      </>
    );
  },
};
