// The worked example in plugins/halo/skills/build-ui/examples. Edit it here: the website's typecheck
// keeps every component and prop real, and the halo-ds build copies it into the skill.
import { Avatar, BarChart, Badge, Button, Card, DataTable, Statistic, Text } from '@halo-ds/react';
import type { DataTableColumn } from '@halo-ds/react';
import { Plus } from '@phosphor-icons/react';

// Headings are plain h1 and h2, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading)',
};
const sectionTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-xl)/var(--halo-line-height-xl) var(--halo-font-family-heading)',
};

interface Order {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Failed';
  total: number;
}

const orders: Order[] = [
  { id: '1042', customer: 'Ada Obi', status: 'Paid', total: 240 },
  { id: '1041', customer: 'Kofi Mensah', status: 'Pending', total: 85 },
  { id: '1040', customer: 'Lena Park', status: 'Failed', total: 120 },
];

const statusColor = { Paid: 'success', Pending: 'warning', Failed: 'error' } as const;

const columns: DataTableColumn<Order>[] = [
  {
    key: 'customer',
    header: 'Customer',
    sortable: true,
    render: (o) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--halo-spacing-4)' }}>
        <Avatar size="sm" name={o.customer} />
        {o.customer}
      </span>
    ),
  },
  { key: 'status', header: 'Status', render: (o) => <Badge size="sm" color={statusColor[o.status]}>{o.status}</Badge> },
  { key: 'total', header: 'Total', numeric: true, sortable: true, render: (o) => `$${o.total}` },
];

const revenue = [
  { month: 'May', revenue: 32 },
  { month: 'Jun', revenue: 38 },
  { month: 'Jul', revenue: 35 },
  { month: 'Aug', revenue: 44 },
  { month: 'Sep', revenue: 49 },
];

export default function Dashboard() {
  return (
    <main style={{ display: 'grid', gap: 'var(--halo-spacing-9)', padding: 'var(--halo-spacing-10)' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--halo-spacing-7)' }}>
        <div style={{ flex: 1 }}>
          <h1 style={pageTitle}>Overview</h1>
          <Text color="secondary">How the shop is doing this month.</Text>
        </div>
        <Button iconLeft={<Plus />}>New order</Button>
      </header>

      <section
        aria-label="Key numbers"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--halo-spacing-7)' }}
      >
        <Card>
          <Statistic label="Revenue" value={48920} prefix="$" change="+5.6%" trend="up" comparison="vs last month" />
        </Card>
        <Card>
          <Statistic label="Orders" value={312} change="-3.2%" trend="down" comparison="vs last month" />
        </Card>
        <Card>
          <Statistic label="Refund rate" value={1.4} precision={1} suffix="%" change="-0.3%" trend="down" sentiment="positive" comparison="vs last month" />
        </Card>
      </section>

      <Card>
        <BarChart label="Revenue by month, in thousands" data={revenue} xKey="month" series={[{ key: 'revenue', label: 'Revenue' }]} />
      </Card>

      <Card>
        <h2 style={sectionTitle}>Recent orders</h2>
        <DataTable columns={columns} rows={orders} getRowId={(o) => o.id} pageSize={0} />
      </Card>
    </main>
  );
}
