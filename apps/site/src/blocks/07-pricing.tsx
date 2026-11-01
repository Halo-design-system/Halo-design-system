/**
 * Pricing
 * Marketing
 * Three plans side by side with a monthly or yearly switch. The plan most people pick gets the main button.
 */
import { useState } from 'react';
import { Badge, Button, Card, SegmentedControl, Text } from '@halo-ds/react';
import { Check } from '@phosphor-icons/react';

// Headings are plain h1 and h2, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-4xl)/var(--halo-line-height-4xl) var(--halo-font-family-heading)',
};
const planName = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-lg)/var(--halo-line-height-lg) var(--halo-font-family-heading)',
};
const price = {
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-4xl)/var(--halo-line-height-4xl) var(--halo-font-family-heading)',
};

const plans = [
  { name: 'Starter', monthly: 0, description: 'For trying things out on your own.', features: ['1 project', 'Up to 3 people', 'Community help'] },
  { name: 'Team', monthly: 24, description: 'For small teams shipping every week.', features: ['Unlimited projects', 'Up to 20 people', 'Version history', 'Email help within a day'], popular: true },
  { name: 'Business', monthly: 79, description: 'For companies with more people and rules.', features: ['Everything in Team', 'Single sign-on', 'Audit log', 'A named contact'] },
];

export default function Pricing() {
  const [billing, setBilling] = useState('yearly');
  // Yearly billing is two months free
  const amount = (monthly: number) => (billing === 'yearly' ? Math.round((monthly * 10) / 12) : monthly);

  return (
    <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--halo-spacing-10)', justifyItems: 'center', padding: 'var(--halo-spacing-12) var(--halo-spacing-7)' }}>
      <header style={{ display: 'grid', gap: 'var(--halo-spacing-4)', justifyItems: 'center', textAlign: 'center', width: '100%', maxWidth: 560 }}>
        <h1 style={pageTitle}>Pick a plan that fits</h1>
        <Text size="lg" color="secondary">Start free and upgrade when your team grows. Pay yearly and get two months free.</Text>
        <SegmentedControl
          aria-label="Billing"
          value={billing}
          onValueChange={setBilling}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
        />
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--halo-spacing-6)', width: '100%', maxWidth: 1040 }}>
        {plans.map((p) => (
          <Card key={p.name} style={p.popular ? { boxShadow: 'inset 0 0 0 2px var(--halo-border-strong)' } : undefined}>
            <div style={{ display: 'grid', gap: 'var(--halo-spacing-6)', width: '100%' }}>
              <div style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--halo-spacing-4)' }}>
                  <h2 style={planName}>{p.name}</h2>
                  {p.popular && <Badge color="brand">Most popular</Badge>}
                </div>
                <Text color="secondary">{p.description}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--halo-spacing-2)' }}>
                <span style={price}>${amount(p.monthly)}</span>
                <Text as="span" color="secondary">per person / month</Text>
              </div>
              <Button variant={p.popular ? 'primary' : 'secondary'} style={{ width: '100%' }}>
                {p.monthly === 0 ? 'Start for free' : `Choose ${p.name}`}
              </Button>
              <ul style={{ display: 'grid', gap: 'var(--halo-spacing-4)', margin: 0, padding: 0, listStyle: 'none' }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--halo-spacing-4)' }}>
                    <Check aria-hidden="true" style={{ flex: 'none', color: 'var(--halo-icon-primary)' }} />
                    <Text as="span">{f}</Text>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
