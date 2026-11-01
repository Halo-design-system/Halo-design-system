/**
 * Icons, prefixes and suffixes
 * Extra text or an icon inside the box, for units, web addresses and search.
 */
import { Input, InputField } from '@halo-ds/react';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function Demo() {
  return (
    <div className="demo-stack" style={{ width: 320 }}>
      <Input iconLeft={<MagnifyingGlass />} placeholder="Search" aria-label="Search" />
      <InputField label="Website" prefix="https://" placeholder="example.com" />
      <InputField label="Weight" suffix="kg" placeholder="70" defaultValue="72" />
    </div>
  );
}
