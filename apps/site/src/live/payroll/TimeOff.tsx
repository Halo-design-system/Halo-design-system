// Time off: requests waiting for you, and who is away this month on the calendar.
import { useState } from 'react';
import { Avatar, Badge, Button, EventCalendar, Tab, TabList, TabPanel, Tabs, useToast } from '@halo-ds/react';
import { leave as start, requests as waiting } from './data';
import { Shell } from './Shell';

const kinds = [
  { label: 'Annual leave', color: 'var(--halo-tag-blue-surface)' },
  { label: 'Sick leave', color: 'var(--halo-tag-red-surface)' },
  { label: 'Personal', color: 'var(--halo-tag-yellow-surface)' },
  { label: 'Training', color: 'var(--halo-tag-green-surface)' },
];

export default function TimeOff() {
  const { toast } = useToast();
  const [requests, setRequests] = useState(waiting);
  const [approved, setApproved] = useState<string[]>([]);

  const decide = (id: string, yes: boolean) => {
    const r = requests.find((x) => x.id === id)!;
    setRequests(requests.filter((x) => x.id !== id));
    if (yes) setApproved([...approved, r.who]);
    toast({ type: yes ? 'success' : 'information', title: yes ? `Approved for ${r.who}` : `Declined for ${r.who}`, description: 'They get an email now.' });
  };

  return (
    <Shell current="time-off">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Time off</h1>
            <p className="t-sub">October 2026</p>
          </div>
          <Button variant="secondary" onClick={() => toast({ title: 'Leave policy', description: '20 days a year, plus public holidays.' })}>
            Leave policy
          </Button>
        </header>

        <Tabs defaultValue="calendar">
          <TabList aria-label="Time off">
            <Tab value="waiting" badge={requests.length ? <Badge size="sm" color="neutral" count={requests.length} /> : undefined}>
              Waiting
            </Tab>
            <Tab value="approved">Approved</Tab>
            <Tab value="calendar">Calendar</Tab>
          </TabList>

          <TabPanel value="waiting">
            <section className="t-panel" style={{ marginTop: 'var(--halo-spacing-9)' }} aria-label="Waiting">
              {requests.length ? (
                requests.map((r) => (
                  <div key={r.id} className="s-call" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto auto' }}>
                    <span className="t-person">
                      <Avatar src={r.src} name={r.who} size="md" />
                      <span className="t-two-lines">
                        <strong>{r.who}</strong>
                        <span>{r.what}</span>
                      </span>
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => decide(r.id, false)}>
                      Decline
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => decide(r.id, true)}>
                      Approve
                    </Button>
                  </div>
                ))
              ) : (
                <p className="t-muted">Nothing waiting. You&apos;re all caught up.</p>
              )}
            </section>
          </TabPanel>

          <TabPanel value="approved">
            <section className="t-panel" style={{ marginTop: 'var(--halo-spacing-9)' }} aria-label="Approved">
              {[...approved, 'Kemi Martins', 'Amaka Uche', 'Jonas Schmidt'].map((who) => (
                <div key={who} className="k-row">
                  <strong>{who}</strong>
                  <Badge size="sm" color="success">
                    Approved
                  </Badge>
                </div>
              ))}
            </section>
          </TabPanel>

          <TabPanel value="calendar">
            <div className="t-detail" style={{ marginTop: 'var(--halo-spacing-9)' }}>
              <EventCalendar events={start} defaultMonth={new Date(2026, 9, 1)} defaultValue={new Date(2026, 9, 11)} defaultView="month" maxEvents={3} />
              <div className="t-actions" aria-label="Key">
                {kinds.map((k) => (
                  <span key={k.label} className="t-person t-muted">
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: k.color }} aria-hidden="true" />
                    {k.label}
                  </span>
                ))}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </Shell>
  );
}
