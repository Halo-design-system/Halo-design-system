/**
 * Number and code
 * A number with minus and plus buttons, and one box per digit for sign-in codes. Pasting fills them all.
 */
import { NumberInput, VerificationCode } from '@halo-ds/react';

export default function Demo() {
  return (
    <div className="demo-stack">
      <NumberInput label="Guests" placeholder="1" defaultValue={2} min={1} max={10} />
      <VerificationCode length={6} defaultValue="482" />
    </div>
  );
}
