// Filing a return, step 2: tick what you can claim, enter amounts and add receipts. The summary updates as you type.
import { useState } from 'react';
import { Badge, BreadcrumbItem, Breadcrumbs, Button, Checkbox, FileItem, FileUpload, Input, Stepper, useToast } from '@halo-ds/react';
import { useNav } from '../kit';
import { naira } from './data';
import { Shell } from './Shell';

const claims = [
  { id: 'pension', label: 'Pension contributions', hint: 'Money paid into a registered pension scheme', amount: 240000, on: true },
  { id: 'health', label: 'Health insurance', hint: 'Premiums for you and your family', amount: 180000, on: true },
  { id: 'home', label: 'Home office', hint: 'A share of rent and power if you work from home', amount: 0, on: false },
  { id: 'charity', label: 'Charity donations', hint: 'Gifts to approved organisations', amount: 50000, on: true },
];

const income = 9600000;
const paid = 860000;

export default function Return() {
  const go = useNav();
  const { toast } = useToast();
  const [items, setItems] = useState(claims);
  const [files, setFiles] = useState([
    { name: 'Health-insurance-2026.pdf', size: 2_400_000, progress: 100 },
    { name: 'Pension-statement-Q3.pdf', size: 2_400_000, progress: 45 },
  ]);

  const deductions = items.filter((i) => i.on).reduce((n, i) => n + i.amount, 0);
  const taxable = income - deductions;
  // A simple flat estimate for the example: about 13.6% of taxable income
  const tax = Math.round((taxable * 0.1358) / 1000) * 1000;

  const update = (id: string, change: Partial<(typeof claims)[number]>) => setItems(items.map((i) => (i.id === id ? { ...i, ...change } : i)));

  return (
    <Shell current="return">
      <div className="t-page">
        <header className="t-head">
          <div>
            <Breadcrumbs size="sm">
              <BreadcrumbItem href="#" onClick={(e) => (e.preventDefault(), go('overview'))}>
                Returns
              </BreadcrumbItem>
              <BreadcrumbItem>2026 income tax</BreadcrumbItem>
            </Breadcrumbs>
            <h1 style={{ marginTop: 'var(--halo-spacing-4)' }}>2026 income tax return</h1>
            <p className="t-sub">Self-assessment for freelancers. Due 31 Mar 2027.</p>
          </div>
          <Badge color="neutral">Draft saved 2 minutes ago</Badge>
        </header>

        <Stepper
          aria-label="Return steps"
          current={1}
          steps={[
            { title: 'Income', description: 'Salary and invoices' },
            { title: 'Deductions', description: 'What you can claim' },
            { title: 'Review', description: 'Check the numbers' },
            { title: 'Submit', description: 'Send to FIRS' },
          ]}
        />

        <div className="k-send">
          <section className="t-panel" aria-labelledby="z-claim">
            <div>
              <h2 id="z-claim">What can you claim?</h2>
              <p className="t-muted">Tick what applies and enter the amount for the year. Each one lowers the income you pay tax on.</p>
            </div>
            <div>
              {items.map((i) => (
                <div key={i.id} className="z-claim">
                  <Checkbox label={i.label} description={i.hint} checked={i.on} onCheckedChange={(on) => update(i.id, { on })} />
                  <Input
                    aria-label={`${i.label} amount`}
                    placeholder="₦0"
                    inputMode="numeric"
                    disabled={!i.on}
                    value={i.amount ? `₦${i.amount.toLocaleString('en-NG')}` : ''}
                    onChange={(e) => update(i.id, { amount: Number(e.target.value.replace(/\D/g, '')) || 0 })}
                  />
                </div>
              ))}
            </div>

            <div className="t-detail" style={{ gap: 'var(--halo-spacing-6)' }}>
              <div>
                <h2>Receipts</h2>
                <p className="t-muted">Add a receipt for each deduction. PDF or photo, up to 10 MB.</p>
              </div>
              <FileUpload
                multiple
                accept=".pdf,.png,.jpg"
                maxSize={10_000_000}
                title="Drag files here"
                description="PNG, JPG or PDF, up to 10 MB"
                buttonLabel="Browse files"
                onFiles={(list) => setFiles([...files, ...list.map((f) => ({ name: f.name, size: f.size, progress: 100 }))])}
              />
              {files.map((f) => (
                <FileItem
                  key={f.name}
                  name={f.name}
                  size={f.size}
                  status={f.progress < 100 ? 'uploading' : 'complete'}
                  progress={f.progress}
                  onCancel={() => setFiles(files.filter((x) => x.name !== f.name))}
                  onRemove={() => setFiles(files.filter((x) => x.name !== f.name))}
                />
              ))}
            </div>
          </section>

          <section className="t-panel" aria-labelledby="z-summary">
            <h2 id="z-summary">Summary</h2>
            <dl className="k-summary">
              <div>
                <dt>Total income</dt>
                <dd>{naira(income)}</dd>
              </div>
              <div>
                <dt>Deductions</dt>
                <dd>{naira(-deductions)}</dd>
              </div>
              <div>
                <dt>Taxable income</dt>
                <dd>{naira(taxable)}</dd>
              </div>
              <div className="k-total">
                <dt>Estimated tax</dt>
                <dd>{naira(tax)}</dd>
              </div>
              <div>
                <dt>Already paid</dt>
                <dd>{naira(paid)}</dd>
              </div>
              <div className="k-total" style={{ borderTop: 0, paddingTop: 0 }}>
                <dt>Left to pay</dt>
                <dd>{naira(Math.max(0, tax - paid))}</dd>
              </div>
            </dl>
            <Button size="lg" onClick={() => go('paid')}>
              Continue to review
            </Button>
            <Button size="lg" variant="secondary" onClick={() => toast({ type: 'success', title: 'Draft saved', description: 'Pick up where you left off any time.' })}>
              Save draft
            </Button>
            <p className="t-muted">Numbers update as you type. Nothing is sent until you submit.</p>
          </section>
        </div>
      </div>
    </Shell>
  );
}
