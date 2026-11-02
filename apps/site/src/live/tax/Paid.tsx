// The receipt after paying VAT: what was paid, to whom, and a code anyone can scan to check it.
import { Button, QRCode, useToast } from '@halo-ds/react';
import { Check, DownloadSimple } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { Shell } from './Shell';

const rows = [
  ['Amount', '₦126,500.00'],
  ['Paid to', 'Federal Inland Revenue Service'],
  ['From', 'Kova Business ··4421'],
  ['Date', 'Sat 10 Oct 2026, 11:20 AM'],
  ['Receipt number', 'FIRS-VAT-0926-88213'],
];

export default function Paid() {
  const go = useNav();
  const { toast } = useToast();
  return (
    <Shell current="paid">
      <section className="z-paid" aria-labelledby="z-done">
        <span className="z-tick" aria-hidden="true">
          <Check weight="bold" />
        </span>
        <div className="t-detail" style={{ gap: 'var(--halo-spacing-4)' }}>
          <h1 id="z-done">VAT paid and filed</h1>
          <p className="t-muted" style={{ margin: 0 }}>
            FIRS confirmed your payment. Nothing else to do for September.
          </p>
        </div>
        <dl className="k-summary z-box">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="z-box z-qr">
          <QRCode value="https://example.com/verify/FIRS-VAT-0926-88213" size={96} label="Receipt check code" />
          <span className="t-two-lines">
            <strong>Scan to check it is genuine</strong>
            <span>Anyone you share this receipt with can confirm it with FIRS.</span>
          </span>
        </div>
        <div className="t-social" style={{ width: '100%' }}>
          <Button variant="secondary" iconLeft={<DownloadSimple />} onClick={() => toast({ type: 'success', title: 'Receipt downloaded', description: 'FIRS-VAT-0926-88213.pdf' })}>
            Download receipt
          </Button>
          <Button onClick={() => go('overview')}>Back to overview</Button>
        </div>
      </section>
    </Shell>
  );
}
