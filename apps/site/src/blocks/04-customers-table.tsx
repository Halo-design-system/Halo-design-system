/**
 * Customers table
 * Application
 * A list page: search, a status filter in the column header, row selection with bulk actions, sorting and pages.
 */
import { useState } from 'react';
import type { Key } from 'react';
import { Avatar, Badge, Button, DataTable, Input, TableToolbar, Text } from '@halo-ds/react';
import type { DataTableColumn } from '@halo-ds/react';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';

// Headings are plain h1, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading)',
};

interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Trial' | 'Paused';
  spent: number;
  joined: string;
}

const customers: Customer[] = [
  { id: 1, name: 'Ada Obi', email: 'ada@example.com', status: 'Active', spent: 4210, joined: 'Mar 2024' },
  { id: 2, name: 'Kofi Mensah', email: 'kofi@example.com', status: 'Trial', spent: 0, joined: 'Aug 2026' },
  { id: 3, name: 'Lena Park', email: 'lena@example.com', status: 'Active', spent: 12890, joined: 'Jan 2023' },
  { id: 4, name: 'Tomás Silva', email: 'tomas@example.com', status: 'Paused', spent: 640, joined: 'Jun 2025' },
  { id: 5, name: 'Priya Nair', email: 'priya@example.com', status: 'Active', spent: 2380, joined: 'Nov 2024' },
  { id: 6, name: 'Jonas Weber', email: 'jonas@example.com', status: 'Active', spent: 990, joined: 'Feb 2026' },
  { id: 7, name: 'Mei Chen', email: 'mei@example.com', status: 'Trial', spent: 0, joined: 'Aug 2026' },
];

const statusColor = { Active: 'success', Trial: 'information', Paused: 'neutral' } as const;

const columns: DataTableColumn<Customer>[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    render: (c) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--halo-spacing-4)' }}>
        <Avatar size="sm" name={c.name} />
        <span style={{ display: 'grid' }}>
          {c.name}
          <Text as="span" size="sm" color="secondary">{c.email}</Text>
        </span>
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (c) => <Badge color={statusColor[c.status]} dot>{c.status}</Badge>,
    filters: [
      { value: 'Active', label: 'Active' },
      { value: 'Trial', label: 'Trial' },
      { value: 'Paused', label: 'Paused' },
    ],
  },
  { key: 'joined', header: 'Joined' },
  { key: 'spent', header: 'Spent', numeric: true, sortable: true, render: (c) => `$${c.spent.toLocaleString('en-US')}` },
];

export default function CustomersTable() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Key[]>([]);
  const q = query.trim().toLowerCase();
  const rows = customers.filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.includes(q));

  return (
    <main style={{ display: 'grid', gap: 'var(--halo-spacing-8)', padding: 'var(--halo-spacing-10) var(--halo-spacing-7)' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--halo-spacing-6)' }}>
        <div style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
          <h1 style={pageTitle}>Customers</h1>
          <Text color="secondary">{customers.length} people have bought from you.</Text>
        </div>
        <Button iconLeft={<Plus />}>Add customer</Button>
      </header>

      <DataTable
        bordered
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        columns={columns}
        rows={rows}
        getRowId={(c) => c.id}
        pageSize={5}
        toolbar={
          <TableToolbar
            selectedCount={selected.length}
            onClearSelection={() => setSelected([])}
            bulkActions={<Button variant="secondary" size="sm">Export</Button>}
            actions={
              <Input
                size="sm"
                aria-label="Search customers"
                placeholder="Search by name or email"
                iconLeft={<MagnifyingGlass />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            }
          />
        }
      />
    </main>
  );
}
