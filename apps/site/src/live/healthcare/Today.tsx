// Nimbo's day view: today's numbers, the schedule, lab results to review and the patient list.
import { useState } from 'react';
import { Avatar, Badge, Button, Card, CompactButton, DataTable, Input, LinkButton, Menu, Select, Statistic, TableToolbar, useToast } from '@halo-ds/react';
import type { BadgeColor, DataTableColumn } from '@halo-ds/react';
import { Buildings, Clock, DotsThree, Funnel, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { day, labs, me, roster, schedule as start } from './data';
import type { Standing, Visit } from './data';
import { Shell } from './Shell';

const visitColor: Record<Visit, BadgeColor> = { 'In consultation': 'information', Waiting: 'warning', 'Checked in': 'success', Booked: 'neutral', Seen: 'neutral' };
const standingColor: Record<Standing, BadgeColor> = { 'Follow-up due': 'warning', Stable: 'success', 'In treatment': 'information', 'Results ready': 'error' };
type Row = (typeof roster)[number];

export default function Today() {
  const go = useNav();
  const { toast } = useToast();
  const [clinic, setClinic] = useState('lekki');
  const [schedule, setSchedule] = useState(start);
  const [query, setQuery] = useState('');

  const callIn = (id: string) => {
    setSchedule(schedule.map((s) => (s.id === id ? { ...s, status: 'In consultation' } : s.status === 'In consultation' ? { ...s, status: 'Seen' } : s)));
    toast({ type: 'success', title: 'Patient called in', description: 'Their name is on the waiting room screen.' });
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: 'who',
      header: 'Patient',
      sortable: true,
      sortValue: (r) => r.who.name,
      render: (r) => (
        <span className="t-person">
          <Avatar src={r.who.src} name={r.who.name} size="sm" />
          <span className="t-two-lines">
            <span>{r.who.name}</span>
            <span>{r.who.about}</span>
          </span>
        </span>
      ),
    },
    { key: 'last', header: 'Last visit', sortable: true, sortValue: (r) => r.last.getTime(), render: (r) => day(r.last) },
    { key: 'condition', header: 'Condition', render: (r) => r.condition },
    { key: 'doctor', header: 'Doctor', render: (r) => r.doctor },
    {
      key: 'status',
      header: 'Status',
      filters: (Object.keys(standingColor) as Standing[]).map((s) => ({ value: s, label: s })),
      onFilter: (r, v) => v.includes(r.status),
      render: (r) => (
        <Badge size="sm" color={standingColor[r.status]}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'more',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (r) => (
        <Menu
          aria-label={`${r.who.name} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${r.who.name}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: 'Open record', onSelect: () => go('patient') },
            { label: 'New prescription', onSelect: () => go('prescribe') },
          ]}
        />
      ),
    },
  ];

  return (
    <Shell current="today">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Good morning, {me.short}</h1>
            <p className="t-sub">Saturday 10 October 2026</p>
          </div>
          <div className="t-actions">
            <div style={{ width: 180 }}>
              <Select aria-label="Clinic" icon={<Buildings />} value={clinic} onValueChange={setClinic} options={[{ value: 'lekki', label: 'Lekki clinic' }, { value: 'ikeja', label: 'Ikeja clinic' }]} />
            </div>
            <Button iconLeft={<Plus />} onClick={() => toast({ title: 'New appointment', description: 'Pick a patient, a time and a reason.' })}>
              New appointment
            </Button>
          </div>
        </header>

        <div className="t-stats">
          <Card>
            <Statistic label="Appointments today" value={24} comparison="6 still to come" />
          </Card>
          <Card>
            <Statistic label="In the waiting room" value={schedule.filter((s) => s.status === 'Waiting' || s.status === 'Checked in').length} />
            <Badge size="sm" color="warning" icon={<Clock />}>
              Average wait 12 min
            </Badge>
          </Card>
          <Card>
            <Statistic label="New patients this week" value={18} change="+4" trend="up" sentiment="positive" comparison="vs last week" />
          </Card>
          <Card>
            <Statistic label="Unpaid bills" value="₦420,000" />
            <Badge size="sm" color="error">
              7 bills
            </Badge>
          </Card>
        </div>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="n-schedule">
            <div className="t-panel-head">
              <div>
                <h2 id="n-schedule">Today&apos;s schedule</h2>
                <p className="t-muted">You have {schedule.filter((s) => s.status !== 'Seen').length + 1} appointments left</p>
              </div>
              <LinkButton size="sm" onClick={() => go('appointments')}>
                Full calendar
              </LinkButton>
            </div>
            {schedule.map((s) => (
              <div key={s.id} className="s-call" style={{ gridTemplateColumns: '72px minmax(0, 1fr) auto auto' }}>
                <strong style={{ fontSize: 'var(--halo-font-size-sm)' }}>{s.time}</strong>
                <span className="t-person">
                  <Avatar src={s.who.src} name={s.who.name} size="md" />
                  <span className="t-two-lines">
                    <strong>{s.who.name}</strong>
                    <span>{s.why}</span>
                  </span>
                </span>
                <Badge size="sm" color={visitColor[s.status]}>
                  {s.status}
                </Badge>
                {s.status === 'Waiting' ? (
                  <Button size="sm" variant="secondary" onClick={() => callIn(s.id)}>
                    Call in
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => go('patient')}>
                    Open
                  </Button>
                )}
              </div>
            ))}
          </section>

          <section className="t-panel" aria-labelledby="n-labs">
            <div className="t-panel-head">
              <div>
                <h2 id="n-labs">Lab results to review</h2>
                <p className="t-muted">4 new since yesterday</p>
              </div>
              <LinkButton size="sm" onClick={() => go('records')}>
                See all
              </LinkButton>
            </div>
            {labs.map((l) => (
              <div key={l.id} className="k-row">
                <span className="t-two-lines">
                  <strong>{l.test}</strong>
                  <span>{l.who}</span>
                </span>
                <Badge size="sm" color={l.tone}>
                  {l.result}
                </Badge>
              </div>
            ))}
          </section>
        </div>

        <DataTable
          aria-label="Patients"
          columns={columns}
          rows={roster.filter((r) => `${r.who.name} ${r.condition}`.toLowerCase().includes(query.trim().toLowerCase()))}
          getRowId={(r) => r.id}
          pageSize={4}
          toolbar={
            <TableToolbar
              title="Patients"
              description="1,248 patients at this clinic"
              actions={
                <>
                  <Input size="sm" aria-label="Search patients" placeholder="Search" iconLeft={<MagnifyingGlass />} value={query} onChange={(e) => setQuery(e.target.value)} />
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
