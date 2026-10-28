// The worked example in plugins/halo/skills/build-ui/examples. Edit it here: the website's typecheck
// keeps every component and prop real, and the halo-ds build copies it into the skill.
import { useState } from 'react';
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  Form,
  FormActions,
  FormRow,
  FormSection,
  InputField,
  Modal,
  Switch,
  Text,
  useToast,
} from '@halo-ds/react';

// Headings are plain h1 and h2, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading)',
};
const sectionTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-xl)/var(--halo-line-height-xl) var(--halo-font-family-heading)',
};

export default function AccountSettings() {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);

  return (
    <main
      style={{
        display: 'grid',
        gap: 'var(--halo-spacing-10)',
        maxWidth: 720,
        margin: '0 auto',
        padding: 'var(--halo-spacing-10) var(--halo-spacing-7)',
      }}
    >
      <header style={{ display: 'grid', gap: 'var(--halo-spacing-4)' }}>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Settings</BreadcrumbItem>
        </Breadcrumbs>
        <h1 style={pageTitle}>Account settings</h1>
        <Text color="secondary">Change your profile and how we contact you.</Text>
      </header>

      <Form onSubmit={() => { toast({ type: 'success', title: 'Changes saved' }); }}>
        <FormSection title="Profile" description="How other people see you.">
          <FormRow>
            <InputField name="firstName" label="First name" required defaultValue="Ada" />
            <InputField name="lastName" label="Last name" required defaultValue="Obi" />
          </FormRow>
          <InputField name="email" label="Email" type="email" required defaultValue="ada@example.com" />
        </FormSection>

        <FormSection title="Notifications">
          <Switch controlPosition="end" label="Comments" description="When someone replies to you." defaultChecked />
          <Switch controlPosition="end" label="Weekly summary" description="Every Monday morning." />
        </FormSection>

        <FormActions>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </Form>

      <Card>
        <h2 style={sectionTitle}>Delete account</h2>
        <Text color="secondary">Your projects and files are deleted too. This can&apos;t be undone.</Text>
        <Button variant="destructive" onClick={() => setConfirming(true)}>
          Delete account
        </Button>
      </Card>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        type="destructive"
        title="Delete your account?"
        description="Your projects and files are deleted too. This can't be undone."
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setConfirming(false)}>
              Delete account
            </Button>
          </>
        }
      />
    </main>
  );
}
