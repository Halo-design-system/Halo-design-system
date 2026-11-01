/**
 * Sign in
 * Authentication
 * Email and password with a show-password button, sign-in with Google or GitHub, and links to reset a password or create an account.
 */
import type { FormEvent } from 'react';
import { Button, Checkbox, Divider, InputField, LinkButton, PasswordInput, SocialButton, Text } from '@halo-ds/react';
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

export default function SignIn() {
  const signIn = (e: FormEvent) => {
    e.preventDefault();
    // Send the email and password to your sign-in endpoint
  };

  return (
    <main style={{ display: 'grid', justifyItems: 'center', padding: 'var(--halo-spacing-12) var(--halo-spacing-7)' }}>
      <div style={{ display: 'grid', gap: 'var(--halo-spacing-8)', width: '100%', maxWidth: 400 }}>
        <header style={{ display: 'grid', gap: 'var(--halo-spacing-5)' }}>
          <span style={logo} aria-hidden="true">
            <Hexagon />
          </span>
          <div style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
            <h1 style={title}>Sign in</h1>
            <Text color="secondary">Welcome back. Sign in to pick up where you left off.</Text>
          </div>
        </header>

        <div style={{ display: 'grid', gap: 'var(--halo-spacing-4)' }}>
          <SocialButton provider="google" variant="outline" fullWidth />
          <SocialButton provider="github" variant="outline" fullWidth />
        </div>

        <Divider label="or" />

        <form onSubmit={signIn} style={{ display: 'grid', gap: 'var(--halo-spacing-6)' }}>
          <InputField label="Email" name="email" type="email" autoComplete="email" placeholder="johndoe@example.com" required />
          <PasswordInput label="Password" name="password" required />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--halo-spacing-4)' }}>
            <Checkbox size="sm" name="remember" label="Keep me signed in" />
            <LinkButton href="#" size="sm">Forgot password?</LinkButton>
          </div>
          <Button type="submit" style={{ width: '100%' }}>Sign in</Button>
        </form>

        <Text color="secondary" style={{ textAlign: 'center' }}>
          New here? <LinkButton href="#">Create an account</LinkButton>
        </Text>
      </div>
    </main>
  );
}
