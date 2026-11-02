// Zephra's overview: a deadline warning, this year's numbers, deadlines, tax paid by month and documents.
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Alert, Badge, BarChart, Button, Card, CompactButton, DataTable, Input, LinkButton, Menu, ProgressBar, SegmentedControl, Select, Statistic, TableToolbar, useToast } from '@halo-ds/react';
import type { BadgeColor, DataTableColumn } from '@halo-ds/react';
import { Bank, CalendarBlank, CheckCircle, Clock, Coins, DotsThree, Funnel, MagnifyingGlass, Plus, Receipt, UploadSimple } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { day, deadlines, documents, naira, taxPaid } from './data';
import type { DocStatus } from './data';
import { Shell } from './Shell';

const kindIcon: Record<string, ReactElement> = { vat: <Receipt />, bank: <Bank />, coins: <Coins />, done: <CheckCircle /> };
const deadlineColor: Record<string, BadgeColor> = { 'Due soon': 'warning', Upcoming: 'neutral', Filed: 'success' };
const docColor: Record<DocStatus, BadgeColor> = { Verified: 'success', 'Needs review': 'warning', 'Missing info': 'error' };
type Doc = (typeof documents)[number];

export default function Overview() {
  const go = useNav();
  const { toast } = useToast();
  const [year, setYear] = useState('2026');
  const [tax, setTax] = useState<'all' | 'vat' | 'income'>('all');
  const [warn, setWarn] = useState(true);
  const [query, setQuery] = useState('');

  const columns: DataTableColumn<Doc>[] = [
    {
      key: 'name',
      header: 'Document',
      render: (d) => (
        <span className="t-two-lines">
          <span>{d.name}</span>
          <span>{d.about}</span>
        </span>
      ),
    },
    { key: 'category', header: 'Category', render: (d) => d.category },
    { key: 'date', header: 'Date', sortable: true, sortValue: (d) => d.date.getTime(), render: (d) => day(d.date) },
    {
      key: 'status',
      header: 'Status',
      filters: (Object.keys(docColor) as DocStatus[]).map((s) => ({ value: s, label: s })),
      onFilter: (d, v) => v.includes(d.status),
      render: (d) => (
        <Badge size="sm" color={docColor[d.status]}>
          {d.status}
        </Badge>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', sortable: true, sortValue: (d) => d.amount, render: (d) => naira(d.amount) },
    {
      key: 'more',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (d) => (
        <Menu
          aria-label={`${d.name} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${d.name}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: 'Open receipt', onSelect: () => go('receipts') },
            { label: 'Delete', destructive: true, onSelect: () => toast({ title: `${d.name} deleted` }) },
          ]}
        />
      ),
    },
  ];

  return (
    <Shell current="overview">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Tax overview</h1>
            <p className="t-sub">Freelancer, Lagos State. Last updated today at 9:40 AM.</p>
          </div>
          <div className="t-actions">
            <div style={{ width: 200 }}>
              <Select aria-label="Tax year" icon={<CalendarBlank />} value={year} onValueChange={setYear} options={[{ value: '2026', label: '2026 tax year' }, { value: '2025', label: '2025 tax year' }]} />
            </div>
            <Button variant="secondary" iconLeft={<UploadSimple />} onClick={() => go('receipts')}>
              Upload receipts
            </Button>
            <Button iconLeft={<Plus />} onClick={() => go('return')}>
              File a return
            </Button>
          </div>
        </header>

        {warn && (
          <Alert
            type="warning"
            title="Your September VAT return is due in 6 days"
            description="File by 21 Oct 2026 to avoid a ₦50,000 late filing penalty."
            onClose={() => setWarn(false)}
          />
        )}

        <div className="t-stats">
          <Card>
            <Statistic label="Estimated tax for 2026" value={naira(1240000)} />
            <Badge size="sm" color="neutral">
              Based on 9 months
            </Badge>
          </Card>
          <Card>
            <div className="t-neutral t-detail" style={{ gap: 'var(--halo-spacing-4)' }}>
              <Statistic label="Paid so far" value={naira(860000)} />
              <ProgressBar value={69} size="sm" aria-label="Paid so far" />
              <span className="t-muted">Of this year&apos;s estimate</span>
            </div>
          </Card>
          <Card>
            <Statistic label="Deductions found" value={naira(410000)} change="+₦52,000" trend="up" sentiment="positive" comparison="this month" />
          </Card>
          <Card>
            <Statistic label="Next payment" value={naira(126500)} />
            <Badge size="sm" color="warning" icon={<Clock />}>
              Due 21 Oct
            </Badge>
          </Card>
        </div>

        <div className="t-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)' }}>
          <section className="t-panel" aria-labelledby="z-deadlines">
            <div className="t-panel-head">
              <div>
                <h2 id="z-deadlines">Deadlines</h2>
                <p className="t-muted">Next 90 days</p>
              </div>
              <LinkButton size="sm" onClick={() => go('deadlines')}>
                Calendar
              </LinkButton>
            </div>
            {deadlines.map((d) => (
              <div key={d.id} className="z-deadline">
                <span className={`z-icon${d.status === 'Due soon' ? ' z-icon-soon' : d.status === 'Filed' ? ' z-icon-done' : ''}`} aria-hidden="true">
                  {kindIcon[d.kind]}
                </span>
                <span className="t-two-lines">
                  <strong>{d.name}</strong>
                  <span>{d.detail}</span>
                </span>
                <Badge size="sm" color={deadlineColor[d.status]}>
                  {d.status}
                </Badge>
              </div>
            ))}
          </section>

          <section className="t-panel" aria-labelledby="z-paid">
            <div className="t-panel-head">
              <div>
                <h2 id="z-paid">Tax paid by month</h2>
                <p className="t-muted">{naira(860000)} paid in 2026</p>
              </div>
              <SegmentedControl
                aria-label="Tax"
                size="sm"
                value={tax}
                onValueChange={(v) => setTax(v as typeof tax)}
                options={[
                  { value: 'all', label: 'All taxes' },
                  { value: 'vat', label: 'VAT' },
                  { value: 'income', label: 'Income' },
                ]}
              />
            </div>
            <BarChart label="Tax paid by month" data={taxPaid[tax]} xKey="m" series={[{ key: 'paid', label: 'Paid' }]} formatValue={(n) => `₦${n}k`} height={220} />
          </section>
        </div>

        <DataTable
          aria-label="Documents"
          columns={columns}
          rows={documents.filter((d) => d.name.toLowerCase().includes(query.trim().toLowerCase()))}
          getRowId={(d) => d.id}
          pageSize={4}
          toolbar={
            <TableToolbar
              title="Documents"
              description="24 receipts and invoices this year"
              actions={
                <>
                  <Input size="sm" aria-label="Search documents" placeholder="Search" iconLeft={<MagnifyingGlass />} value={query} onChange={(e) => setQuery(e.target.value)} />
                  <Button size="sm" variant="secondary" iconLeft={<Funnel />}>
                    Filter
                  </Button>
                </>
              }
            />
          }
        />
      </div>
    </Shell>
  );
}
