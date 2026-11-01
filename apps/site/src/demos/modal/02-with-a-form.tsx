/**
 * With a form
 * A field in the content area. data-autofocus gives it focus first.
 */
import { useState } from 'react';
import { Button, InputField, Modal } from '@halo-ds/react';

export default function Demo() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Rename</Button>
      <Modal
        open={open}
        onClose={close}
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
}
