import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { DatePickerField } from '../DatePicker';
import { InputField } from '../Input';
import { SelectField } from '../Select';
import { TextareaField } from '../Textarea';
import { Form, FormActions, FormRow, FormSection } from './Form';
import type { FormValues } from './Form';

const meta = {
  title: 'Components/Form',
  component: Form,
  subcomponents: { FormSection, FormRow, FormActions },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A form that checks itself. Give each field a `name`: inside a `Form`, it shows the form’s error for that name, and `required` fields are checked for you. Add your own rules with `validate`, which returns a message for each field name with a problem. Errors show after the first submit, focus moves to the first problem, and errors update as people fix them. Lay fields out with `FormSection`, `FormRow` and `FormActions`, and use `layout="horizontal"` to put labels beside fields.',
      },
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

const roles = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
];

const Result = ({ values }: { values: FormValues | null }) =>
  values ? (
    <pre style={{ margin: 0, padding: 16, borderRadius: 12, background: 'var(--halo-surface-secondary)', font: '13px/20px var(--halo-font-family-mono, monospace)' }}>{JSON.stringify(values, null, 2)}</pre>
  ) : null;

/** Sections, a row of two fields, required fields and one custom rule. Submit it empty to see the errors. */
export const Playground: Story = {
  render: function Render() {
    const [sent, setSent] = useState<FormValues | null>(null);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
        <Form
          onSubmit={(values) => setSent(values)}
          validate={(v) => ({
            email: v.email && !String(v.email).includes('@') ? 'Enter an email address, like name@company.com.' : undefined,
          })}
        >
          <FormSection title="Personal details" description="We use these on your invoices.">
            <FormRow>
              <InputField name="firstName" label="First name" placeholder="John" required />
              <InputField name="lastName" label="Last name" placeholder="Doe" required />
            </FormRow>
            <InputField name="email" label="Email" type="email" placeholder="johndoe@example.com" required hint="We send receipts here." />
          </FormSection>
          <FormSection title="Work">
            <SelectField name="team" label="Team" options={roles} required placeholder="Choose a team" />
            <DatePickerField name="start" label="Start date" optional />
            <TextareaField name="notes" label="Notes" optional placeholder="Anything we should know" />
          </FormSection>
          <FormActions divider>
            <Button variant="secondary" type="reset">Cancel</Button>
            <Button type="submit">Save</Button>
          </FormActions>
        </Form>
        <Result values={sent} />
      </div>
    );
  },
};

/** Labels beside fields, common in settings and admin screens. They move above fields on small screens. */
export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <Form layout="horizontal" labelWidth={180} onSubmit={() => {}}>
        <InputField name="workspace" label="Workspace name" placeholder="Acme Inc." required defaultValue="Northwind" />
        <InputField name="url" label="Workspace URL" placeholder="acme" hint="Letters, numbers and dashes." defaultValue="northwind" />
        <SelectField name="region" label="Data region" options={[{ value: 'eu', label: 'Europe' }, { value: 'us', label: 'United States' }]} defaultValue="eu" />
        <FormActions>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </Form>
    </div>
  ),
};
