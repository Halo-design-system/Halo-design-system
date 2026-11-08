/**
 * People
 * Options can have an avatar, which shows in the list and on the tag.
 */
import { Avatar, ComboboxField } from '@halo-ds/react';

const people = ['Ada Obi', 'Jonas Schmidt', 'Lara Pinto'].map((name) => ({
  value: name,
  label: name,
  avatar: <Avatar size="xs" name={name} />,
}));

export default function Demo() {
  return (
    <div style={{ width: 320, minHeight: 240 }}>
      <ComboboxField label="Assign to" multiple options={people} defaultValue={['Ada Obi']} placeholder="Choose people" />
    </div>
  );
}
