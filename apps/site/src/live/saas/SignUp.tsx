// Create a workspace: email and password, or Google or Apple, beside a customer's words.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Avatar, Button, Divider, InputField, LinkButton, PasswordInput, Rating, SocialButton } from '@halo-ds/react';
import { EnvelopeSimple } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { people } from './data';
import { Logo } from './Shell';
import './saas.css';

export default function SignUp() {
  const go = useNav();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const emailError = tried && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter your work email, like you@company.com.' : undefined;
  const passwordError = tried && !(password.length >= 8 && /\d/.test(password)) ? 'Use 8 or more characters, with a number.' : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (/^\S+@\S+\.\S+$/.test(email) && password.length >= 8 && /\d/.test(password)) go('overview');
  };

  return (
    <div className="t-auth">
      <div className="t-auth-form">
        <Logo />
        <form className="t-auth-body" onSubmit={submit} noValidate>
          <div>
            <h1>Create your workspace</h1>
            <p className="t-sub">Plan projects, track progress and see what your team ships. Free for teams up to 5.</p>
          </div>
          <InputField label="Work email" type="email" placeholder="you@company.com" iconLeft={<EnvelopeSimple />} value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
          <PasswordInput label="Password" placeholder="At least 8 characters" hint={passwordError ? undefined : 'Use 8 or more characters, with a number.'} value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} />
          <Button type="submit" size="lg">
            Create workspace
          </Button>
          <Divider label="or" />
          <div className="t-social">
            <SocialButton provider="google" variant="outline" fullWidth onClick={() => go('overview')}>
              Google
            </SocialButton>
            <SocialButton provider="apple" variant="outline" fullWidth onClick={() => go('overview')}>
              Apple
            </SocialButton>
          </div>
          <p className="t-muted">
            Already using Tessel? <LinkButton size="sm" onClick={() => go('overview')}>Log in</LinkButton>
          </p>
        </form>
        <div className="t-auth-foot">
          <span>© 2026 Tessel</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
      <div className="t-auth-art">
        <figure className="t-quote" style={{ margin: 0 }}>
          <Rating value={5} readOnly aria-label="5 out of 5" size="sm" />
          <blockquote style={{ margin: 0 }}>
            <p>&ldquo;We moved four tools into Tessel in a week. Now our Monday meeting takes ten minutes, not an hour.&rdquo;</p>
          </blockquote>
          <figcaption className="t-person">
            <Avatar src={people.nadia.src} name={people.nadia.name} size="md" />
            <span className="t-two-lines">
              <strong>{people.nadia.name}</strong>
              <span>{people.nadia.team}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
