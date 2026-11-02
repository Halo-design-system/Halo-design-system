// Payouts: what you can withdraw now, what's on the way, and every payout so far.
import { useState } from 'react';
import { Badge, Button, Card, DataTable, InputField, Modal, Statistic, TableToolbar, useToast } from '@halo-ds/react';
import type { DataTableColumn } from '@halo-ds/react';
import { ArrowUpRight, Funnel } from '@phosphor-icons/react';
import { me, naira, payouts as start } from './data';
import type { PayoutStatus } from './data';
import { Shell } from './Shell';

type Row = (typeof start)[number];

const columns: DataTableColumn<Row>[] = [
  { key: 'date', header: 'Date', sortable: true, sortValue: (r) => r.sort, render: (r) => r.date },
  { key: 'to', header: 'To', render: (r) => r.to },
  {
    key: 'status',
    header: 'Status',
    filters: (['Paid', 'Returned'] as PayoutStatus[]).map((s) => ({ value: s, label: s })),
    onFilter: (r, v) => v.includes(r.status),
    render: (r) => (
      <Badge size="sm" color={r.status === 'Paid' ? 'success' : 'error'}>
        {r.status}
      </Badge>
    ),
  },
  { key: 'amount', header: 'Amount', align: 'right', sortable: true, sortValue: (r) => r.amount, render: (r) => naira(r.amount) },
];

export default function Payouts() {
  const { toast } = useToast();
  const [available, setAvailable] = useState(640000);
  const [rows, setRows] = useState(start);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(640000);
  const tooMuch = amount > available;

  return (
    <Shell current="payouts">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Payouts</h1>
            <p className="t-sub">Money from calls, tickets and products</p>
          </div>
          <Button iconLeft={<ArrowUpRight />} disabled={!available} onClick={() => setOpen(true)}>
            Withdraw
          </Button>
        </header>

        <div className="t-stats s-three">
          <Card>
            <Statistic label="Available to withdraw" value={naira(available)} comparison={available ? 'Ready now' : 'Nothing to withdraw'} />
          </Card>
          <Card>
            <Statistic label="On its way" value={naira(220000)} comparison="From sales in the last 2 days" />
          </Card>
          <Card>
            <Statistic label="Paid out this year" value={naira(8420000 + (640000 - available))} comparison={`${31 + rows.length - start.length} payouts`} />
          </Card>
        </div>

        <section className="t-panel s-account" aria-label="Payout account">
          <span className="t-person">
            <span className="k-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 30 30" style={{ fill: 'var(--halo-icon-primary)' }}>
                <path d="M15 1 29 15 15 29 1 15Z M15 10 10 15 15 20 20 15Z" fillRule="evenodd" />
              </svg>
            </span>
            <span className="t-two-lines">
              <strong>Payout account: Kova ··7782</strong>
              <span>{me.name} · automatic payouts every Monday</span>
            </span>
          </span>
          <Button variant="secondary" size="sm" onClick={() => toast({ title: 'Change payout account', description: 'Add a Nigerian bank account in your name.' })}>
            Change
          </Button>
        </section>

        <DataTable
          aria-label="History"
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          toolbar={
            <TableToolbar
              title="History"
              description="Last 30 days"
              actions={
                <Button size="sm" variant="secondary" iconLeft={<Funnel />}>
                  Filter
                </Button>
              }
            />
          }
        />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Withdraw"
        description={`To Kova ··7782. Arrives in a few minutes. You have ${naira(available)}.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!amount || tooMuch}
              onClick={() => {
                setAvailable(available - amount);
                setRows([{ id: `o${Date.now()}`, date: 'Today', sort: 9, to: 'Kova ··7782', status: 'Paid', amount }, ...rows]);
                setOpen(false);
                toast({ type: 'success', title: `${naira(amount)} on its way`, description: 'To Kova ··7782.' });
              }}
            >
              Withdraw {naira(amount)}
            </Button>
          </>
        }
      >
        <InputField
          label="Amount"
          placeholder="₦640,000"
          inputMode="numeric"
          value={amount ? naira(amount) : ''}
          onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, '')) || 0)}
          error={tooMuch ? `You can withdraw up to ${naira(available)}.` : undefined}
        />
      </Modal>
    </Shell>
  );
}
