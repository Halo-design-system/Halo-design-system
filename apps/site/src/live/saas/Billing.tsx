// Plan and billing: an alert when seats run out, this month's usage, and the plans to pick from.
import { useState } from 'react';
import { Alert, Badge, BreadcrumbItem, Breadcrumbs, Button, Modal, NumberInput, ProgressBar, useToast } from '@halo-ds/react';
import { CheckCircle } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { Shell } from './Shell';

const plans = [
  { id: 'free', name: 'Free', price: 0, per: 'For trying Tessel', features: ['5 members', '2 GB storage', '10 projects'] },
  { id: 'team', name: 'Team', price: 8, per: 'per member a month', features: ['Unlimited members', '100 GB storage', 'Unlimited projects', 'Guest access for clients'] },
  { id: 'business', name: 'Business', price: 16, per: 'per member a month', features: ['Everything in Team', 'SSO and audit log', 'Priority support'] },
];

export default function Billing() {
  const go = useNav();
  const { toast } = useToast();
  const [plan, setPlan] = useState('free');
  const [upgrade, setUpgrade] = useState(false);
  const [seats, setSeats] = useState(7);
  const onTeam = plan === 'team';

  return (
    <Shell current="billing">
      <div className="t-page">
        <header>
          <Breadcrumbs size="sm">
            <BreadcrumbItem href="#" onClick={(e) => (e.preventDefault(), go('overview'))}>
              Settings
            </BreadcrumbItem>
            <BreadcrumbItem>Billing</BreadcrumbItem>
          </Breadcrumbs>
          <div className="t-head" style={{ marginTop: 'var(--halo-spacing-4)' }}>
            <div>
              <h1>Plan and billing</h1>
              <p className="t-sub">You&apos;re on the {onTeam ? 'Team' : 'Free'} plan</p>
            </div>
          </div>
        </header>

        {!onTeam && <Alert type="warning" title="You've used all 5 seats" description="Kenji and Funmi can't join until you upgrade or remove someone." />}

        <section className="t-panel" aria-labelledby="t-usage">
          <div>
            <h2 id="t-usage">Usage this month</h2>
            <p className="t-muted">Resets on 1 November</p>
          </div>
          <div className="t-usage">
            <ProgressBar label="Members" valueLabel={onTeam ? `5 of ${seats}` : '5 of 5'} value={5} max={onTeam ? seats : 5} status={onTeam ? 'default' : 'error'} size="sm" />
            <ProgressBar label="Storage" valueLabel={onTeam ? '1.6 GB of 100 GB' : '1.6 GB of 2 GB'} value={1.6} max={onTeam ? 100 : 2} size="sm" />
            <ProgressBar label="Projects" valueLabel={onTeam ? '8 projects' : '8 of 10'} value={8} max={onTeam ? 100 : 10} size="sm" />
          </div>
        </section>

        <div className="t-plans">
          {plans.map((p) => {
            const current = p.id === plan;
            return (
              <section key={p.id} className={`t-panel t-plan${p.id === 'team' ? ' t-plan-pick' : ''}`} aria-labelledby={`plan-${p.id}`}>
                <div className="t-panel-head">
                  <h2 id={`plan-${p.id}`}>{p.name}</h2>
                  {current ? (
                    <Badge size="sm" color="neutral">
                      Current
                    </Badge>
                  ) : p.id === 'team' ? (
                    <Badge size="sm" color="neutral">
                      Most teams pick this
                    </Badge>
                  ) : null}
                </div>
                <div className="t-price">
                  <strong>${p.price}</strong>
                  <span className="t-muted">{p.per}</span>
                </div>
                <ul className="t-features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <CheckCircle aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
                {current ? (
                  <Button variant="secondary" disabled>
                    Current plan
                  </Button>
                ) : p.id === 'team' ? (
                  <Button variant="premium" onClick={() => setUpgrade(true)}>
                    Upgrade to Team
                  </Button>
                ) : p.id === 'free' ? (
                  <Button variant="secondary" onClick={() => setPlan('free')}>
                    Switch to Free
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => toast({ title: 'Message sent', description: 'Our team will reply within a day.' })}>
                    Talk to sales
                  </Button>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <Modal
        open={upgrade}
        onClose={() => setUpgrade(false)}
        title="Upgrade to Team"
        description={`$8 per member a month. You pay $${seats * 8} a month for ${seats} members.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setUpgrade(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPlan('team');
                setUpgrade(false);
                toast({ type: 'success', title: "You're on Team", description: 'Kenji and Funmi can join now.' });
              }}
            >
              Upgrade
            </Button>
          </>
        }
      >
        <NumberInput label="Members" value={seats} min={5} max={500} onValueChange={setSeats} />
      </Modal>
    </Shell>
  );
}
