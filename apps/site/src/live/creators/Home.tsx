// Solin's home: this month's numbers, upcoming calls, the next webinar and products.
import { useState } from 'react';
import { Avatar, AvatarGroup, Badge, Button, Card, CompactButton, DataTable, DatePicker, Input, LinkButton, Menu, Modal, ProgressBar, Statistic, TableToolbar, useToast } from '@halo-ds/react';
import type { DataTableColumn } from '@halo-ds/react';
import { CalendarBlank, Clock, DotsThree, Funnel, MagnifyingGlass, Phone, Plus, ShareNetwork } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { buyers, calls, me, naira, products } from './data';
import { Shell } from './Shell';

type Product = (typeof products)[number];

export default function Home() {
  const go = useNav();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [moving, setMoving] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const call = calls.find((c) => c.id === moving);

  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (p) => (
        <span className="t-two-lines">
          <span>{p.name}</span>
          <span>{p.about}</span>
        </span>
      ),
    },
    { key: 'price', header: 'Price', align: 'right', sortable: true, sortValue: (p) => p.price, render: (p) => naira(p.price) },
    { key: 'sales', header: 'Sales', align: 'right', sortable: true, sortValue: (p) => p.sales, render: (p) => p.sales },
    { key: 'revenue', header: 'Revenue', align: 'right', sortable: true, sortValue: (p) => p.price * p.sales, render: (p) => naira(p.price * p.sales) },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <Badge size="sm" color={p.status === 'Published' ? 'success' : 'neutral'}>
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'more',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (p) => (
        <Menu
          aria-label={`${p.name} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${p.name}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: 'Edit', onSelect: () => go('product') },
            { label: 'Copy link', onSelect: () => toast({ type: 'success', title: 'Link copied', description: `solin.page/temi/${p.id}` }) },
          ]}
        />
      ),
    },
  ];

  return (
    <Shell current="home">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Welcome back, {me.first}</h1>
            <p className="t-sub">Your page: solin.page/temi</p>
          </div>
          <div className="t-actions">
            <Button variant="secondary" iconLeft={<ShareNetwork />} onClick={() => toast({ type: 'success', title: 'Link copied', description: 'solin.page/temi' })}>
              Copy link
            </Button>
            <Menu
              aria-label="Create"
              trigger={
                <Button variant="secondary" iconLeft={<Plus />}>
                  Create
                </Button>
              }
              items={[
                { label: 'Digital product', onSelect: () => go('product') },
                { label: 'Call', onSelect: () => go('calls') },
                { label: 'Webinar', onSelect: () => go('webinars') },
              ]}
            />
          </div>
        </header>

        <div className="t-stats">
          <Card>
            <Statistic label="Earnings this month" value={naira(1860000)} change="+18%" trend="up" sentiment="positive" comparison="vs September" />
          </Card>
          <Card>
            <Statistic label="Calls booked" value={42} change="+6" trend="up" sentiment="positive" comparison="this month" />
          </Card>
          <Card>
            <Statistic label="Webinar tickets" value={318} comparison="Across 3 webinars" />
          </Card>
          <Card>
            <Statistic label="Products sold" value={129} change="+24" trend="up" sentiment="positive" comparison="this month" />
          </Card>
        </div>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="s-calls">
            <div className="t-panel-head">
              <div>
                <h2 id="s-calls">Upcoming calls</h2>
                <p className="t-muted">5 this week</p>
              </div>
              <LinkButton size="sm" onClick={() => go('calls')}>
                See all
              </LinkButton>
            </div>
            {calls.map((c) => (
              <div key={c.id} className="s-call">
                <span className="t-person">
                  <Avatar src={c.src} name={c.who} size="md" />
                  <span className="t-two-lines">
                    <strong>{c.who}</strong>
                    <span>{c.what}</span>
                  </span>
                </span>
                <span className="s-call-when">
                  {c.when}
                  {c.soon && (
                    <Badge size="sm" color="warning" icon={<Clock />}>
                      Starts in 10 min
                    </Badge>
                  )}
                </span>
                {c.soon ? (
                  <Button size="sm" iconLeft={<Phone />} onClick={() => go('lobby')}>
                    Join call
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setMoving(c.id)}>
                    Reschedule
                  </Button>
                )}
              </div>
            ))}
          </section>

          <section className="t-panel" aria-labelledby="s-webinar">
            <div className="t-panel-head">
              <div>
                <h2 id="s-webinar">Next webinar</h2>
                <p className="t-muted">Live in 7 days</p>
              </div>
              <Badge size="sm" color="success">
                Selling
              </Badge>
            </div>
            <strong style={{ fontSize: 'var(--halo-font-size-lg)' }}>Pricing your freelance work</strong>
            <span className="t-person t-muted">
              <CalendarBlank aria-hidden="true" /> Sat 17 Oct, 11:00 AM · 90 min · {naira(8000)} a ticket
            </span>
            <AvatarGroup size="sm" max={4} total={210}>
              {buyers.map((src, i) => (
                <Avatar key={src} src={src} name={['Kemi', 'Amaka', 'Lucas', 'Sofia'][i]} />
              ))}
            </AvatarGroup>
            <div className="t-neutral">
              <ProgressBar label="Seats sold" valueLabel="210 of 300" value={210} max={300} size="sm" />
            </div>
            <div className="t-social">
              <Button variant="secondary" onClick={() => go('webinars')}>
                Open studio
              </Button>
              <Button variant="secondary" iconLeft={<ShareNetwork />} onClick={() => toast({ type: 'success', title: 'Link copied', description: 'solin.page/temi/pricing-webinar' })}>
                Share
              </Button>
            </div>
          </section>
        </div>

        <DataTable
          aria-label="Products"
          columns={columns}
          rows={products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))}
          getRowId={(p) => p.id}
          toolbar={
            <TableToolbar
              title="Products"
              description="4 digital products"
              actions={
                <>
                  <Input size="sm" aria-label="Search products" placeholder="Search" iconLeft={<MagnifyingGlass />} value={query} onChange={(e) => setQuery(e.target.value)} />
                  <Button size="sm" variant="secondary" iconLeft={<Funnel />}>
                    Filter
                  </Button>
                </>
              }
            />
          }
        />
      </div>

      <Modal
        open={!!call}
        onClose={() => setMoving(null)}
        title={`Reschedule with ${call?.who ?? ''}`}
        description="They get an email with the new time and can accept or suggest another."
        actions={
          <>
            <Button variant="secondary" onClick={() => setMoving(null)}>
              Cancel
            </Button>
            <Button
              disabled={!newDate}
              onClick={() => {
                toast({ type: 'success', title: 'New time sent', description: `${call?.who} has been asked to confirm.` });
                setMoving(null);
                setNewDate(null);
              }}
            >
              Send new time
            </Button>
          </>
        }
      >
        <DatePicker aria-label="New date" placeholder="Pick a date" value={newDate} onValueChange={setNewDate} />
      </Modal>
    </Shell>
  );
}
