import { InputField } from '@halo-ds/react';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function Example() {
  return (
    <div style={{ display: 'grid', gap: 20, width: 320 }}>
      <InputField label="Email" type="email" placeholder="name@company.com" hint="We send receipts here." />
      <InputField label="Search" placeholder="Search projects" iconLeft={<MagnifyingGlass />} />
      <InputField label="Username" placeholder="johndoe" defaultValue="ada" error="That name is taken." />
    </div>
  );
}
