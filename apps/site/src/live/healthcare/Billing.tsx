// Billing: what's unpaid, HMO claims waiting, and every invoice. Mark one paid or send a reminder.
import { useState } from 'react';
import { Avatar, Badge, Button, Card, CompactButton, DataTable, Input, Menu, Statistic, TableToolbar, useToast } from '@halo-ds/react';
import type { BadgeColor, DataTableColumn } from '@halo-ds/react';
import { DotsThree, Funnel, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { invoices as start, naira } from './data';
import type { InvoiceStatus } from './data';
import { Shell } from './Shell';

const statusColor: Record<InvoiceStatus, BadgeColor> = { 'Claim sent': 'warning', Paid: 'success', Unpaid: 'error' };
type Row = (typeof start)[number];

export default function Billing() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(start);
  const [query, setQuery] = useState('');
  const unpaid = invoices.filter((i) => i.status === 'Unpaid');

  const markPaid = (id: string) => {
    setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: 'Paid' } : i)));
    toast({ type: 'success', title: `${id} marked as paid` });
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: 'who',
      header: 'Patient',
      render: (r) => (
        <span className="t-person">
          <Avatar src={r.who.src} name={r.who.name} size="sm" />
          <span className="t-two-lines">
            <span>{r.who.name}</span>
            <span>{r.what}</span>
          </span>
        </span>
      ),
    },
    { key: 'id', header: 'Invoice', render: (r) => r.id },
    { key: 'payer', header: 'Paid by', render: (r) => r.payer },
    {
      key: 'status',
      header: 'Status',
      filters: (Object.keys(statusColor) as InvoiceStatus[]).map((s) => ({ value: s, label: s })),
      onFilter: (r, v) => v.includes(r.status),
      render: (r) => (
        <Badge size="sm" color={statusColor[r.status]}>
          {r.status}
        </Badge>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', sortable: true, sortValue: (r) => r.amount, render: (r) => naira(r.amount) },
    {
      key: 'more',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (r) => (
        <Menu
          aria-label={`${r.id} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${r.id}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: 'Mark as paid', disabled: r.status === 'Paid', onSelect: () => markPaid(r.id) },
            { label: 'Send a reminder', disabled: r.status !== 'Unpaid', onSelect: () => toast({ title: 'Reminder sent', description: `${r.who.name} gets a text with a payment link.` }) },
            { label: 'Download', onSelect: () => toast({ type: 'success', title: `${r.id}.pdf downloaded` }) },
          ]}
        />
      ),
    },
  ];

  return (
    <Shell current="billing">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Billing</h1>
            <p className="t-sub">October 2026</p>
          </div>
          <Button iconLeft={<Plus />} onClick={() => toast({ title: 'New invoice', description: 'Pick a patient and add what they had.' })}>
            New invoice
          </Button>
        </header>

        <div className="t-stats s-three">
          <Card>
            <Statistic label="Unpaid" value={naira(420000 - (2 - unpaid.length) * 25000)} />
            <Badge size="sm" color="error">
              {unpaid.length + 5} invoices
            </Badge>
          </Card>
          <Card>
            <Statistic label="HMO claims waiting" value={naira(1180000)} />
            <Badge size="sm" color="warning">
              12 claims
            </Badge>
          </Card>
          <Card>
            <Statistic label="Paid this month" value={naira(3640000)} change="+12%" trend="up" sentiment="positive" />
          </Card>
        </div>

        <DataTable
          aria-label="Invoices"
          columns={columns}
          rows={invoices.filter((i) => `${i.who.name} ${i.id}`.toLowerCase().includes(query.trim().toLowerCase()))}
          getRowId={(r) => r.id}
          toolbar={
            <TableToolbar
              title="Invoices"
              description="Newest first"
              actions={
                <>
                  <Input size="sm" aria-label="Search invoices" placeholder="Search" iconLeft={<MagnifyingGlass />} value={query} onChange={(e) => setQuery(e.target.value)} />
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
