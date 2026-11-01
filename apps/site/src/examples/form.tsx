import { useState } from 'react';
import { Button, Form, FormActions, FormRow, FormSection, InputField, SelectField } from '@halo-ds/react';

export default function Example() {
  const [saved, setSaved] = useState('');
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Form onSubmit={(values) => setSaved(`Saved ${values.firstName}`)}>
        <FormSection title="Your details" description="Submit it empty to see the checks.">
          <FormRow>
            <InputField name="firstName" label="First name" placeholder="John" required />
            <InputField name="lastName" label="Last name" placeholder="Doe" required />
          </FormRow>
          <SelectField
            name="team"
            label="Team"
            required
            placeholder="Choose a team"
            options={[
              { value: 'design', label: 'Design' },
              { value: 'engineering', label: 'Engineering' },
            ]}
          />
        </FormSection>
        <FormActions>
          <Button type="submit">Save</Button>
        </FormActions>
      </Form>
      {saved && <p style={{ marginTop: 16 }}>{saved}</p>}
    </div>
  );
}
