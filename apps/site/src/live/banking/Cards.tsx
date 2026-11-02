// Card controls: show the card's details, freeze it, choose where it works and set a daily limit.
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Badge, Button, Slider, Switch, useToast } from '@halo-ds/react';
import { Car, Eye, EyeSlash, ForkKnife, LockSimple, LockSimpleOpen, Plus, ShoppingCart } from '@phosphor-icons/react';
import { cardActivity, me, naira } from './data';
import { Shell } from './Shell';

const kindIcon: Record<string, ReactElement> = { shop: <ShoppingCart />, ride: <Car />, food: <ForkKnife /> };

export default function Cards() {
  const { toast } = useToast();
  const [details, setDetails] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [limit, setLimit] = useState(200000);
  const [where, setWhere] = useState({ online: true, abroad: false, contactless: true, atm: false });

  const toggle = (key: keyof typeof where, label: string) => (on: boolean) => {
    setWhere({ ...where, [key]: on });
    toast({ title: `${label} ${on ? 'on' : 'off'}`, description: 'Changes apply straight away.' });
  };

  return (
    <Shell current="cards">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Cards</h1>
            <p className="t-sub">Control where and how your cards work.</p>
          </div>
          <Button variant="secondary" iconLeft={<Plus />} onClick={() => toast({ type: 'success', title: 'Virtual card created', description: 'Ready to use online now.' })}>
            New virtual card
          </Button>
        </header>

        <div className="k-cards">
          <div className="t-detail">
            <div className="k-card" data-frozen={frozen || undefined} aria-label="Virtual card ending 4432">
              <div className="k-card-top">
                <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
                  <path d="M15 1 29 15 15 29 1 15Z M15 10 10 15 15 20 20 15Z" fillRule="evenodd" />
                </svg>
                <Badge size="sm" color="neutral">
                  {frozen ? 'Frozen' : 'Virtual'}
                </Badge>
              </div>
              <div className="k-card-number">{details ? '5399 8231 0476 4432' : '•••• •••• •••• 4432'}</div>
              <div className="k-card-foot">
                <div className="t-two-lines">
                  <span>Card holder</span>
                  <strong>{me.name}</strong>
                </div>
                <span>{details ? 'Expires 09/29 · CVV 417' : 'Expires 09/29'}</span>
              </div>
            </div>
            <div className="t-social">
              <Button variant="secondary" iconLeft={details ? <EyeSlash /> : <Eye />} onClick={() => setDetails(!details)}>
                {details ? 'Hide details' : 'Show details'}
              </Button>
              <Button
                variant="secondary"
                iconLeft={frozen ? <LockSimpleOpen /> : <LockSimple />}
                onClick={() => {
                  setFrozen(!frozen);
                  toast({ type: frozen ? 'success' : 'information', title: frozen ? 'Card unfrozen' : 'Card frozen', description: frozen ? 'You can pay with it again.' : 'Payments are blocked until you unfreeze it.' });
                }}
              >
                {frozen ? 'Unfreeze card' : 'Freeze card'}
              </Button>
            </div>
            <section className="t-panel" aria-labelledby="k-recent">
              <h2 id="k-recent">Recent on this card</h2>
              {cardActivity.map((c) => (
                <div key={c.id} className="k-row">
                  <span className="t-person">
                    <span className="k-icon" aria-hidden="true">
                      {kindIcon[c.kind]}
                    </span>
                    <span className="t-two-lines">
                      <strong>{c.who}</strong>
                      <span>{c.when}</span>
                    </span>
                  </span>
                  <strong>{naira(c.amount, false)}</strong>
                </div>
              ))}
            </section>
          </div>

          <div className="t-detail">
            <section className="t-panel" aria-labelledby="k-where">
              <h2 id="k-where">Where this card works</h2>
              <Switch label="Online payments" description="Shops, apps and subscriptions" controlPosition="end" checked={where.online} disabled={frozen} onCheckedChange={toggle('online', 'Online payments')} />
              <Switch label="International payments" description="Charged in dollars or other currencies" controlPosition="end" checked={where.abroad} disabled={frozen} onCheckedChange={toggle('abroad', 'International payments')} />
              <Switch label="Contactless" description="Tap to pay in shops" controlPosition="end" checked={where.contactless} disabled={frozen} onCheckedChange={toggle('contactless', 'Contactless')} />
              <Switch label="ATM withdrawals" description="Virtual cards can't be used at ATMs" controlPosition="end" checked={where.atm} disabled />
            </section>
            <section className="t-panel" aria-labelledby="k-limit">
              <h2 id="k-limit">Spending limit</h2>
              <Slider label="Daily limit" min={0} max={1000000} step={10000} value={limit} onValueChange={setLimit} formatValue={(n) => naira(n, false)} showMinMax disabled={frozen} />
              <p className="t-muted">You&apos;ve spent ₦23,350 of {naira(limit, false)} today. Changes apply straight away.</p>
            </section>
          </div>
        </div>
      </div>
    </Shell>
  );
}
