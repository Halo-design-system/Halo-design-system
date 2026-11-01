import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Card } from '../Card';
import { Result } from './Result';
import type { ResultStatus } from './Result';

const meta = {
  title: 'Components/Result',
  component: Result,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shows the outcome of something people did, like a payment going through, or why a page can’t show, like a missing page or no access. Success, error, warning and information show an icon in a circle. Not found, no access, server error, offline and maintenance show an illustration. Coming from Ant Design: its 404, 403 and 500 are `not-found`, `no-access` and `server-error`.',
      },
    },
  },
  args: {
    status: 'success',
    title: 'Payment sent',
    description: 'We’ve emailed a receipt to you and the person you paid.',
    actions: (
      <>
        <Button variant="secondary">View receipt</Button>
        <Button>Back to overview</Button>
      </>
    ),
  },
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj<typeof meta>;

const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))', gap: 24 };

export const Playground: Story = {};

/** Icon statuses, for the outcome of an action. */
export const Statuses: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const items: [ResultStatus, string, string][] = [
      ['success', 'Payment sent', 'We’ve emailed a receipt to you and the person you paid.'],
      ['error', 'Payment failed', 'Your bank declined it. Check your card details or try another card.'],
      ['warning', 'Sent with a problem', 'Two of the five invitations bounced. Check the email addresses.'],
      ['information', 'Request received', 'We’ll review it within two working days and email you.'],
    ];
    return (
      <div style={grid}>
        {items.map(([status, title, description]) => (
          <Card key={status}>
            <Result size="sm" status={status} title={title} description={description} actions={<Button size="sm">Done</Button>} />
          </Card>
        ))}
      </div>
    );
  },
};

/** Illustration statuses, for pages that can't show. */
export const ErrorPages: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const items: [ResultStatus, string, string][] = [
      ['not-found', 'Page not found', 'The link may be old, or the page has moved.'],
      ['no-access', 'You don’t have access', 'Ask a workspace admin to invite you.'],
      ['server-error', 'Something went wrong', 'It’s on our side. Try again in a few minutes.'],
      ['offline', 'You’re offline', 'Check your connection. We’ll reload when you’re back.'],
      ['maintenance', 'Back soon', 'We’re making updates and will be back within the hour.'],
    ];
    return (
      <div style={grid}>
        {items.map(([status, title, description]) => (
          <Card key={status}>
            <Result size="sm" status={status} title={title} description={description} actions={<Button size="sm" variant="secondary">Go home</Button>} />
          </Card>
        ))}
      </div>
    );
  },
};

/** With details under the text, like a receipt. */
export const WithDetails: Story = {
  render: () => (
    <Card style={{ width: 480 }}>
      <Result
        status="success"
        title="Tax paid and filed"
        description="Your payment is confirmed. Nothing else to do this month."
        actions={
          <>
            <Button variant="secondary">Download receipt</Button>
            <Button>Back to overview</Button>
          </>
        }
      >
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', margin: 0, padding: 16, borderRadius: 12, background: 'var(--halo-surface-secondary)', font: '14px/22px var(--halo-font-family-body)' }}>
          <dt style={{ color: 'var(--halo-text-contrast)' }}>Amount</dt>
          <dd style={{ margin: 0, textAlign: 'end' }}>$1,265.00</dd>
          <dt style={{ color: 'var(--halo-text-contrast)' }}>Date</dt>
          <dd style={{ margin: 0, textAlign: 'end' }}>10 Oct 2026</dd>
          <dt style={{ color: 'var(--halo-text-contrast)' }}>Reference</dt>
          <dd style={{ margin: 0, textAlign: 'end' }}>TAX-0926-88213</dd>
        </dl>
      </Result>
    </Card>
  ),
};
