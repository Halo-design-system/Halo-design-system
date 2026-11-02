// Contacts: everyone you sell to, with their company and stage. Pick rows to act on several at once.
import { useState } from 'react';
import type { Key } from 'react';
import { Avatar, Badge, Button, CompactButton, DataTable, Input, Menu, SegmentedControl, TableToolbar, useToast } from '@halo-ds/react';
import type { BadgeColor, DataTableColumn } from '@halo-ds/react';
import { DotsThree, Funnel, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { contacts } from './data';
import type { Contact } from './data';
import { Shell } from './Shell';

const stageColor: Record<string, BadgeColor> = { Customer: 'success', Lead: 'information', Cold: 'neutral' };

export default function Contacts() {
  const go = useNav();
  const { toast } = useToast();
  const [view, setView] = useState('everyone');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Key[]>([]);

  const columns: DataTableColumn<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      sortValue: (c) => c.name,
      render: (c) => (
        <span className="t-person">
          <Avatar src={c.src} name={c.name} size="sm" />
          <span className="t-two-lines">
            <span>{c.name}</span>
            <span>{c.title}</span>
          </span>
        </span>
      ),
    },
    { key: 'company', header: 'Company', sortable: true, sortValue: (c) => c.company, render: (c) => c.company },
    {
      key: 'stage',
      header: 'Stage',
      render: (c) => (
        <Badge size="sm" color={stageColor[c.stage]}>
          {c.stage}
        </Badge>
      ),
    },
    { key: 'owner', header: 'Owner', render: (c) => c.owner.name },
    { key: 'last', header: 'Last contacted', sortable: true, sortValue: (c) => -c.order, render: (c) => c.last },
    {
      key: 'more',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (c) => (
        <Menu
          aria-label={`${c.name} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${c.name}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: 'Open deal', onSelect: () => go('deal') },
            { label: 'Send email', onSelect: () => toast({ title: 'Email draft opened', description: `To ${c.name}.` }) },
          ]}
        />
      ),
    },
  ];

  const rows = contacts
    .filter((c) => view === 'everyone' || (view === 'leads' ? c.stage === 'Lead' : c.stage === 'Customer'))
    .filter((c) => `${c.name} ${c.company}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Shell current="contacts">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Contacts</h1>
            <p className="t-sub">1,248 people at 312 companies</p>
          </div>
          <div className="t-actions">
            <Button variant="secondary" onClick={() => toast({ type: 'success', title: 'Import started', description: "We'll email you when your contacts are in." })}>
              Import
            </Button>
            <Button iconLeft={<Plus />} onClick={() => toast({ title: 'New contact', description: 'Add their name, email and company.' })}>
              Add contact
            </Button>
          </div>
        </header>

        <div>
          <SegmentedControl
            aria-label="Who"
            size="sm"
            value={view}
            onValueChange={setView}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'leads', label: 'Leads' },
              { value: 'customers', label: 'Customers' },
            ]}
          />
        </div>

        <DataTable
          aria-label="Contacts"
          columns={columns}
          rows={rows}
          getRowId={(c) => c.id}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          pageSize={7}
          toolbar={
            <TableToolbar
              title={view === 'everyone' ? 'Everyone' : view === 'leads' ? 'Leads' : 'Customers'}
              description="Sorted by last contacted"
              selectedCount={selected.length}
              onClearSelection={() => setSelected([])}
              bulkActions={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    toast({ type: 'success', title: `Email sent to ${selected.length} ${selected.length === 1 ? 'person' : 'people'}` });
                    setSelected([]);
                  }}
                >
                  Send email
                </Button>
              }
              actions={
                <>
                  <Input size="sm" aria-label="Search contacts" placeholder="Search" iconLeft={<MagnifyingGlass />} value={query} onChange={(e) => setQuery(e.target.value)} />
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
