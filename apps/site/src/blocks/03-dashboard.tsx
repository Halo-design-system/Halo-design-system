/**
 * Dashboard
 * Application
 * Four key numbers with how they changed, revenue over the year, and the latest orders, with a period switch at the top.
 */
import { useState } from 'react';
import { AreaChart, Avatar, Badge, Button, Card, DataTable, SegmentedControl, Statistic, Text } from '@halo-ds/react';
import type { DataTableColumn } from '@halo-ds/react';
import { DownloadSimple } from '@phosphor-icons/react';

// Headings are plain h1 and h2, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading)',
};
const sectionTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-lg)/var(--halo-line-height-lg) var(--halo-font-family-heading)',
};

const revenue = [
  { month: 'Jan', revenue: 18200 },
  { month: 'Feb', revenue: 21400 },
  { month: 'Mar', revenue: 19800 },
  { month: 'Apr', revenue: 24600 },
  { month: 'May', revenue: 27900 },
  { month: 'Jun', revenue: 26300 },
  { month: 'Jul', revenue: 31200 },
  { month: 'Aug', revenue: 33800 },
];

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Refunded';
  total: number;
}

const orders: Order[] = [
  { id: '#3214', customer: 'Ada Obi', date: 'Aug 28', status: 'Paid', total: 240 },
  { id: '#3213', customer: 'Kofi Mensah', date: 'Aug 28', status: 'Pending', total: 85 },
  { id: '#3212', customer: 'Lena Park', date: 'Aug 27', status: 'Paid', total: 1120 },
  { id: '#3211', customer: 'Tomás Silva', date: 'Aug 26', status: 'Refunded', total: 64 },
];

const statusColor = { Paid: 'success', Pending: 'warning', Refunded: 'neutral' } as const;
const money = (n: number) => `$${n.toLocaleString('en-US')}`;

const columns: DataTableColumn<Order>[] = [
  {
    key: 'customer',
    header: 'Customer',
    render: (o) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--halo-spacing-4)' }}>
        <Avatar size="sm" name={o.customer} />
        {o.customer}
      </span>
    ),
  },
  { key: 'id', header: 'Order' },
  { key: 'date', header: 'Date' },
  { key: 'status', header: 'Status', render: (o) => <Badge color={statusColor[o.status]}>{o.status}</Badge> },
  { key: 'total', header: 'Total', numeric: true, render: (o) => money(o.total) },
];

export default function Dashboard() {
  const [period, setPeriod] = useState('30d');

  return (
    <main style={{ display: 'grid', gap: 'var(--halo-spacing-9)', padding: 'var(--halo-spacing-10) var(--halo-spacing-7)' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--halo-spacing-6)' }}>
        <div style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
          <h1 style={pageTitle}>Overview</h1>
          <Text color="secondary">How your store is doing.</Text>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--halo-spacing-4)' }}>
          <SegmentedControl
            aria-label="Period"
            value={period}
            onValueChange={setPeriod}
            options={[
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '12m', label: '12 months' },
            ]}
          />
          <Button variant="secondary" iconLeft={<DownloadSimple />}>Export</Button>
        </div>
      </header>

      <section aria-label="Key numbers" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--halo-spacing-6)' }}>
        <Card><Statistic label="Revenue" value={33800} prefix="$" change="+8.4%" trend="up" comparison="vs last month" /></Card>
        <Card><Statistic label="Orders" value={1284} change="+3.1%" trend="up" comparison="vs last month" /></Card>
        <Card><Statistic label="Average order" value={26.3} precision={2} prefix="$" change="-1.2%" trend="down" comparison="vs last month" /></Card>
        <Card><Statistic label="Refund rate" value={1.8} precision={1} suffix="%" change="-0.4%" trend="down" sentiment="positive" comparison="vs last month" /></Card>
      </section>

      <Card>
        {/* Card lines its content up at the start, so stretch this to the full width for the chart */}
        <div style={{ display: 'grid', gap: 'var(--halo-spacing-6)', width: '100%' }}>
          <h2 style={sectionTitle}>Revenue</h2>
          <AreaChart label="Revenue by month this year" data={revenue} xKey="month" series={[{ key: 'revenue', label: 'Revenue' }]} height={240} formatValue={money} />
        </div>
      </Card>

      <section style={{ display: 'grid', gap: 'var(--halo-spacing-6)' }} aria-labelledby="latest-orders">
        <h2 id="latest-orders" style={sectionTitle}>Latest orders</h2>
        <DataTable bordered columns={columns} rows={orders} getRowId={(o) => o.id} pageSize={0} />
      </section>
    </main>
  );
}
