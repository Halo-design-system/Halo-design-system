/**
 * Sign up
 * Authentication
 * Name, email and a password with its rules shown up front, an agreement to the terms, and sign-up with Google or GitHub.
 */
import type { FormEvent } from 'react';
import { Button, Checkbox, Divider, FormRow, InputField, LinkButton, PasswordInput, SocialButton, Text } from '@halo-ds/react';
import { Hexagon } from '@phosphor-icons/react';

// Headings are plain h1, styled with Halo's type tokens. Text is for body copy.
const title = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-2xl)/var(--halo-line-height-2xl) var(--halo-font-family-heading)',
};

// Your logo goes here
const logo = {
  display: 'grid',
  placeItems: 'center',
  width: 40,
  height: 40,
  borderRadius: 'var(--halo-radius-4)',
  boxShadow: 'inset 0 0 0 1px var(--halo-border-secondary)',
  color: 'var(--halo-icon-primary)',
  fontSize: 24,
};

export default function SignUp() {
  const signUp = (e: FormEvent) => {
    e.preventDefault();
    // Send the details to your sign-up endpoint
  };

  return (
    <main style={{ display: 'grid', justifyItems: 'center', padding: 'var(--halo-spacing-12) var(--halo-spacing-7)' }}>
      <div style={{ display: 'grid', gap: 'var(--halo-spacing-8)', width: '100%', maxWidth: 440 }}>
        <header style={{ display: 'grid', gap: 'var(--halo-spacing-5)' }}>
          <span style={logo} aria-hidden="true">
            <Hexagon />
          </span>
          <div style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
            <h1 style={title}>Create your account</h1>
            <Text color="secondary">Free for 14 days. No card needed.</Text>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--halo-spacing-4)' }}>
          <SocialButton provider="google" variant="outline" fullWidth>Google</SocialButton>
          <SocialButton provider="github" variant="outline" fullWidth>GitHub</SocialButton>
        </div>

        <Divider label="or" />

        <form onSubmit={signUp} style={{ display: 'grid', gap: 'var(--halo-spacing-6)' }}>
          <FormRow>
            <InputField label="First name" name="firstName" autoComplete="given-name" placeholder="John" required />
            <InputField label="Last name" name="lastName" autoComplete="family-name" placeholder="Doe" required />
          </FormRow>
          <InputField label="Work email" name="email" type="email" autoComplete="email" placeholder="johndoe@example.com" required />
          <PasswordInput label="Password" name="password" autoComplete="new-password" hint="At least 8 characters, with a number." required />
          <Checkbox
            size="sm"
            name="terms"
            required
            label={
              <>
                I agree to the <LinkButton href="#" size="sm">Terms</LinkButton> and <LinkButton href="#" size="sm">Privacy policy</LinkButton>
              </>
            }
          />
          <Button type="submit" style={{ width: '100%' }}>Create account</Button>
        </form>

        <Text color="secondary" style={{ textAlign: 'center' }}>
          Already have an account? <LinkButton href="#">Sign in</LinkButton>
        </Text>
      </div>
    </main>
  );
}
