// A payslip: pick someone and see their earnings, deductions and net pay. Download it or email it to them.
import { useState } from 'react';
import { Badge, BreadcrumbItem, Breadcrumbs, Button, Select, useToast } from '@halo-ds/react';
import { DownloadSimple, EnvelopeSimple, UsersThree } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { naira, staff } from './data';
import { Logo, Shell } from './Shell';
import './payroll.css';

/** Splits gross pay the way Nigerian payslips usually do: basic, housing and transport. */
function breakdown(gross: number, paye: number, pension: number) {
  const basic = Math.round(gross * 0.6);
  const housing = Math.round(gross * 0.25);
  const transport = gross - basic - housing;
  const nhf = Math.round(basic * 0.025);
  return { earnings: [['Basic salary', basic], ['Housing', housing], ['Transport', transport]] as const, deductions: [['PAYE tax', paye], ['Pension (8%)', pension], ['NHF (2.5%)', nhf]] as const, total: paye + pension + nhf, employer: Math.round(gross * 0.1) };
}

export default function Payslip() {
  const go = useNav();
  const { toast } = useToast();
  const [who, setWho] = useState('jonas');
  const e = staff.find((s) => s.id === who)!;
  const b = breakdown(e.gross, e.paye, e.pension);
  const first = e.name.split(' ')[0];

  return (
    <Shell current="payslip">
      <div className="t-page">
        <header className="t-head">
          <div>
            <Breadcrumbs size="sm">
              <BreadcrumbItem href="#" onClick={(ev) => (ev.preventDefault(), go('overview'))}>
                Payslips
              </BreadcrumbItem>
              <BreadcrumbItem>October 2026</BreadcrumbItem>
            </Breadcrumbs>
            <h1 style={{ marginTop: 'var(--halo-spacing-4)' }}>Payslip</h1>
            <p className="t-sub">Paid on Friday 23 October 2026</p>
          </div>
          <div className="t-actions">
            <div style={{ width: 210 }}>
              <Select aria-label="Employee" icon={<UsersThree />} value={who} onValueChange={setWho} options={staff.map((s) => ({ value: s.id, label: s.name }))} />
            </div>
            <Button variant="secondary" iconLeft={<DownloadSimple />} onClick={() => toast({ type: 'success', title: 'Payslip downloaded', description: `${e.name}, October 2026.pdf` })}>
              Download PDF
            </Button>
            <Button iconLeft={<EnvelopeSimple />} disabled={e.bank === 'Missing'} onClick={() => toast({ type: 'success', title: `Emailed to ${first}` })}>
              Email to {first}
            </Button>
          </div>
        </header>

        <article className="a-slip" aria-label={`Payslip for ${e.name}`}>
          <header className="k-row a-slip-head">
            <span className="t-person">
              <Logo size={34} />
              <span className="t-two-lines">
                <strong style={{ fontSize: 'var(--halo-font-size-lg)' }}>Brightline Media Ltd</strong>
                <span>14 Admiralty Way, Lekki, Lagos</span>
              </span>
            </span>
            <Badge size="sm" color={e.bank === 'Missing' ? 'error' : 'success'}>
              {e.bank === 'Missing' ? 'Not paid' : 'Paid'}
            </Badge>
          </header>

          <dl className="a-facts">
            {[
              ['Employee', e.name],
              ['Role', e.role],
              ['Pay period', '1 to 31 Oct 2026'],
              ['Bank', e.bank],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="a-columns">
            {[
              ['Earnings', b.earnings, 'Total earnings', e.gross],
              ['Deductions', b.deductions, 'Total deductions', b.total],
            ].map(([title, rows, totalLabel, total]) => (
              <section key={title as string} aria-label={title as string}>
                <h2>{title as string}</h2>
                <dl className="k-summary">
                  {(rows as readonly (readonly [string, number])[]).map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{naira(v)}</dd>
                    </div>
                  ))}
                  <div className="k-total a-dashed">
                    <dt>{totalLabel as string}</dt>
                    <dd>{naira(total as number)}</dd>
                  </div>
                </dl>
              </section>
            ))}
          </div>

          <div className="a-net">
            <span className="t-two-lines">
              <strong>Net pay</strong>
              <span>After tax, pension and housing fund</span>
            </span>
            <strong className="a-net-value">{naira(e.gross - b.total)}</strong>
          </div>
          <p className="t-muted" style={{ margin: 0 }}>
            Employer pension of {naira(b.employer)} (10%) was paid on top and is not taken from your pay.
          </p>
        </article>
      </div>
    </Shell>
  );
}
