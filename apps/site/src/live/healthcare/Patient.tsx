// A patient's record: vitals, visit notes, allergies, medicines and the next appointment.
import { useState } from 'react';
import { Avatar, Badge, Button, Card, DatePicker, EmptyState, Illustration, Modal, Statistic, Tab, TabList, TabPanel, Tabs, Tag, useToast } from '@halo-ds/react';
import { ChatCircle, Plus } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { patients } from './data';
import { Shell } from './Shell';

const notes = [
  { date: '3 Oct 2026', by: 'Dr. Ifeoma Chukwu', text: 'Antenatal check at 28 weeks. Baby moving well, heartbeat 142. Mild anaemia; started iron and folic acid. Review in 2 weeks.' },
  { date: '5 Sep 2026', by: 'Dr. Ifeoma Chukwu', text: 'Anatomy scan normal. Patient reports tiredness. Ordered full blood count.' },
  { date: '8 Aug 2026', by: 'Dr. Samuel Obi', text: 'Booking visit. Blood group O+, no known conditions. Allergic to penicillin.' },
];

const medicines = [
  { name: 'Ferrous sulphate 200 mg', how: 'Twice a day, with food' },
  { name: 'Folic acid 5 mg', how: 'Once a day' },
  { name: 'Paracetamol 500 mg', how: 'When needed, up to 4 a day' },
];

export default function Patient() {
  const go = useNav();
  const { toast } = useToast();
  const [moving, setMoving] = useState(false);
  const [next, setNext] = useState<Date | null>(new Date(2026, 9, 12));
  const p = patients.halima;

  return (
    <Shell current="patient">
      <div className="t-page">
        <header className="t-head">
          <div className="v-title">
            <Avatar src={p.src} name={p.name} size="xl" />
            <div className="t-detail" style={{ gap: 'var(--halo-spacing-2)' }}>
              <h1>{p.name}</h1>
              <p className="t-sub" style={{ margin: 0 }}>
                29 years · Female · Patient ID NB-20418
              </p>
              <span className="t-actions" style={{ gap: 'var(--halo-spacing-4)' }}>
                <Badge size="sm" color="neutral">
                  Blood group O+
                </Badge>
                <Badge size="sm" color="information">
                  Pregnant, 28 weeks
                </Badge>
                <Badge size="sm" color="neutral">
                  HMO: Reliance Care
                </Badge>
              </span>
            </div>
          </div>
          <div className="t-actions">
            <Button variant="secondary" iconLeft={<ChatCircle />} onClick={() => toast({ title: 'Message sent', description: 'Halima gets it in the Nimbo app.' })}>
              Message
            </Button>
            <Button iconLeft={<Plus />} onClick={() => go('prescribe')}>
              New prescription
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview">
          <TabList aria-label="Record">
            <Tab value="overview">Overview</Tab>
            <Tab value="visits">Visits</Tab>
            <Tab value="prescriptions">Prescriptions</Tab>
            <Tab value="labs">Lab results</Tab>
            <Tab value="billing" onClick={() => go('billing')}>
              Billing
            </Tab>
          </TabList>
          <TabPanel value="overview">
            <div className="t-detail" style={{ marginTop: 'var(--halo-spacing-9)' }}>
              <div className="t-stats">
                <Card>
                  <Statistic label="Blood pressure" value="118/76" suffix="mmHg" />
                  <Badge size="sm" color="success">
                    Normal
                  </Badge>
                </Card>
                <Card>
                  <Statistic label="Heart rate" value={84} suffix="bpm" />
                  <Badge size="sm" color="success">
                    Normal
                  </Badge>
                </Card>
                <Card>
                  <Statistic label="Weight" value={71} suffix="kg" comparison="+1.2 kg in 4 weeks" />
                  <Badge size="sm" color="success">
                    On track
                  </Badge>
                </Card>
                <Card>
                  <Statistic label="Haemoglobin" value={10.4} precision={1} suffix="g/dL" />
                  <Badge size="sm" color="warning">
                    A little low
                  </Badge>
                </Card>
              </div>

              <div className="t-split">
                <section className="t-panel" aria-labelledby="n-notes">
                  <h2 id="n-notes">Visit notes</h2>
                  {notes.map((n) => (
                    <article key={n.date} className="t-detail" style={{ gap: 'var(--halo-spacing-4)', paddingTop: 'var(--halo-spacing-7)', borderTop: '1px solid var(--halo-border-secondary)' }}>
                      <span>
                        <strong>{n.date}</strong> <span className="t-muted">· {n.by}</span>
                      </span>
                      <p style={{ margin: 0 }}>{n.text}</p>
                    </article>
                  ))}
                </section>

                <div className="t-detail">
                  <section className="t-panel" aria-labelledby="n-allergies">
                    <h2 id="n-allergies">Allergies</h2>
                    <span className="t-actions" style={{ gap: 'var(--halo-spacing-4)' }}>
                      <Tag>Penicillin</Tag>
                      <Tag>Peanuts</Tag>
                    </span>
                  </section>
                  <section className="t-panel" aria-labelledby="n-meds">
                    <h2 id="n-meds">Current medicines</h2>
                    {medicines.map((m) => (
                      <div key={m.name} className="k-row">
                        <span className="t-two-lines">
                          <strong>{m.name}</strong>
                          <span>{m.how}</span>
                        </span>
                        <Badge size="sm" color="success">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </section>
                  <section className="t-panel" aria-labelledby="n-next">
                    <h2 id="n-next">Next appointment</h2>
                    <span className="t-two-lines">
                      <span style={{ color: 'var(--halo-text-primary)' }}>{next ? next.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Not booked'}, 11:00 AM</span>
                      <span>Antenatal check with Dr. Ifeoma Chukwu</span>
                    </span>
                    <span>
                      <Button size="sm" variant="secondary" onClick={() => setMoving(true)}>
                        Reschedule
                      </Button>
                    </span>
                  </section>
                </div>
              </div>
            </div>
          </TabPanel>
          {['visits', 'prescriptions', 'labs', 'billing'].map((v) => (
            <TabPanel key={v} value={v}>
              <EmptyState media={<Illustration name="no-health-records" size={140} />} title="Nothing here yet" description="This example shows the overview. The other tabs work the same way." />
            </TabPanel>
          ))}
        </Tabs>
      </div>

      <Modal
        open={moving}
        onClose={() => setMoving(false)}
        title="Reschedule the antenatal check"
        description="Halima gets a text with the new date."
        actions={
          <Button
            onClick={() => {
              setMoving(false);
              toast({ type: 'success', title: 'Appointment moved', description: 'Halima has been told.' });
            }}
          >
            Save
          </Button>
        }
      >
        <DatePicker aria-label="New date" value={next} onValueChange={setNext} />
      </Modal>
    </Shell>
  );
}
