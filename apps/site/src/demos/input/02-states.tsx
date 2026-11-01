/**
 * States
 * Required, optional with an info tip, valid, an error and disabled.
 */
import { InputField } from '@halo-ds/react';

export default function Demo() {
  return (
    <div className="demo-stack" style={{ width: 320 }}>
      <InputField label="Full name" placeholder="John Doe" required defaultValue="Amara Okafor" />
      <InputField label="Company" optional info="Shown on your invoices." placeholder="Studio" />
      <InputField label="Username" placeholder="johndoe" valid defaultValue="amara.okafor" />
      <InputField label="Password" placeholder="••••••••" error="Use at least 8 characters." defaultValue="abc" />
      <InputField label="Email" placeholder="johndoe@example.com" disabled defaultValue="amara@example.com" />
    </div>
  );
}
