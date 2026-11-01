/**
 * Settings
 * Application
 * Profile, notifications and account in tabs. Each tab saves on its own, and deleting the account asks first.
 */
import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  FormActions,
  FormRow,
  FormSection,
  InputField,
  Modal,
  SelectField,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextareaField,
  useToast,
} from '@halo-ds/react';

// Headings are plain h1 and h2, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading)',
};
const sectionTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-lg)/var(--halo-line-height-lg) var(--halo-font-family-heading)',
};

export default function Settings() {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const saved = () => {
    toast({ type: 'success', title: 'Changes saved' });
  };

  return (
    <main style={{ display: 'grid', gap: 'var(--halo-spacing-8)', maxWidth: 760, margin: '0 auto', padding: 'var(--halo-spacing-10) var(--halo-spacing-7)' }}>
      <header style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
        <h1 style={pageTitle}>Settings</h1>
        <Text color="secondary">Manage your profile, what we send you and your account.</Text>
      </header>

      <Tabs defaultValue="profile">
        <TabList aria-label="Settings">
          <Tab value="profile">Profile</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="account">Account</Tab>
        </TabList>

        <TabPanel value="profile" style={{ paddingTop: 'var(--halo-spacing-8)' }}>
          <Form onSubmit={saved}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--halo-spacing-6)' }}>
              <Avatar size="xl" name="Ada Obi" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--halo-spacing-4)' }}>
                <Button variant="secondary" size="sm">Upload photo</Button>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
            </div>
            <FormSection title="About you" description="Shown on your profile and next to your comments.">
              <FormRow>
                <InputField name="firstName" label="First name" placeholder="John" required defaultValue="Ada" />
                <InputField name="lastName" label="Last name" placeholder="Doe" required defaultValue="Obi" />
              </FormRow>
              <InputField name="role" label="Job title" placeholder="Product designer" optional defaultValue="Product designer" />
              <TextareaField name="bio" label="Bio" placeholder="I design tools for small teams." optional rows={3} hint="A sentence or two about what you do." />
            </FormSection>
            <FormActions>
              <Button type="submit">Save profile</Button>
            </FormActions>
          </Form>
        </TabPanel>

        <TabPanel value="notifications" style={{ paddingTop: 'var(--halo-spacing-8)' }}>
          <Form onSubmit={saved}>
            <FormSection title="Email" description="What we send to ada@example.com.">
              <Switch controlPosition="end" label="Comments" description="When someone replies to you or mentions you." defaultChecked />
              <Switch controlPosition="end" label="Weekly summary" description="Your numbers for the week, every Monday morning." defaultChecked />
              <Switch controlPosition="end" label="Product news" description="New features, a few times a year." />
            </FormSection>
            <FormActions>
              <Button type="submit">Save notifications</Button>
            </FormActions>
          </Form>
        </TabPanel>

        <TabPanel value="account" style={{ paddingTop: 'var(--halo-spacing-8)' }}>
          <div style={{ display: 'grid', gap: 'var(--halo-spacing-8)' }}>
            <Form onSubmit={saved}>
              <FormSection title="Sign-in and region">
                <InputField name="email" label="Email" type="email" placeholder="johndoe@example.com" required defaultValue="ada@example.com" />
                <SelectField
                  name="timezone"
                  label="Time zone"
                  defaultValue="lagos"
                  options={[
                    { value: 'lagos', label: 'Lagos (GMT+1)' },
                    { value: 'london', label: 'London (GMT+0)' },
                    { value: 'new-york', label: 'New York (GMT-5)' },
                  ]}
                />
              </FormSection>
              <FormActions>
                <Button type="submit">Save account</Button>
              </FormActions>
            </Form>

            <Card>
              <div style={{ display: 'grid', gap: 'var(--halo-spacing-4)', justifyItems: 'start' }}>
                <h2 style={sectionTitle}>Delete account</h2>
                <Text color="secondary">Your projects and files are deleted too. This can&apos;t be undone.</Text>
                <Button variant="destructive" onClick={() => setConfirming(true)}>Delete account</Button>
              </div>
            </Card>
          </div>
        </TabPanel>
      </Tabs>

      <Modal
        open={confirming}
        onClose={() => setConfirming(false)}
        type="destructive"
        title="Delete your account?"
        description="Your projects and files are deleted too. This can't be undone."
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setConfirming(false)}>Delete account</Button>
          </>
        }
      />
    </main>
  );
}
