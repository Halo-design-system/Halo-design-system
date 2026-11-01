/**
 * Horizontal layout
 * Labels beside fields, common in settings. They move above the fields on small screens.
 */
import { Button, Form, FormActions, InputField, SelectField } from '@halo-ds/react';

export default function Demo() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Form layout="horizontal" labelWidth={160} onSubmit={() => {}}>
        <InputField name="workspace" label="Workspace name" placeholder="Acme Inc." required defaultValue="Northwind" />
        <InputField name="url" label="Workspace URL" placeholder="acme" hint="Letters, numbers and dashes." defaultValue="northwind" />
        <SelectField name="region" label="Data region" options={[{ value: 'eu', label: 'Europe' }, { value: 'us', label: 'United States' }]} defaultValue="eu" />
        <FormActions>
          <Button type="submit">Save</Button>
        </FormActions>
      </Form>
    </div>
  );
}
