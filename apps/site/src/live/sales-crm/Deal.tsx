// One deal: where it is in the pipeline, its activity, and the people and next step around it.
import { useState } from 'react';
import { Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, EmptyState, Illustration, Modal, Stepper, Tab, TabList, TabPanel, Tabs, TextareaField, useToast } from '@halo-ds/react';
import { Buildings, CheckCircle, EnvelopeSimple, Phone } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { contacts, people } from './data';
import { Shell } from './Shell';

const start = [
  { who: people.kemi, text: 'Kemi Martins logged a call with Ada Nwachukwu: legal wants a 30-day exit clause.', when: 'Today, 10:12 AM' },
  { who: people.tolu, text: 'Tolu Adeyemi sent the revised proposal (v3) with 8% off for a 2-year term.', when: 'Yesterday, 4:40 PM' },
  { who: people.kemi, text: 'Kemi Martins moved the deal from Proposal to Negotiation.', when: '3 Oct 2026' },
  { who: contacts[0]!, text: 'Ada Nwachukwu replied: "Pricing works. Waiting on procurement."', when: '1 Oct 2026' },
];

const team = ['ada', 'femi', 'rita'].map((id) => contacts.find((c) => c.id === id)!);
const roles: Record<string, string> = { ada: 'Head of operations · decision maker', femi: 'Procurement', rita: 'Legal' };

export default function Deal() {
  const go = useNav();
  const { toast } = useToast();
  const [stage, setStage] = useState(2);
  const [feed, setFeed] = useState(start);
  const [note, setNote] = useState('');
  const [won, setWon] = useState(false);
  const stageName = ['Qualified', 'Proposal', 'Negotiation', 'Won'][stage];

  const post = (text: string) => setFeed([{ who: people.kemi, text, when: 'Just now' }, ...feed]);

  return (
    <Shell current="pipeline">
      <div className="t-page">
        <Breadcrumbs size="sm">
          <BreadcrumbItem href="#" onClick={(e) => (e.preventDefault(), go('pipeline'))}>
            Deals
          </BreadcrumbItem>
          <BreadcrumbItem>Kestrel Bank</BreadcrumbItem>
        </Breadcrumbs>

        <header className="t-head">
          <div className="v-title">
            <span className="v-logo-box" aria-hidden="true">
              <Buildings />
            </span>
            <div>
              <div className="v-title">
                <h1>Kestrel Bank</h1>
                <Badge size="sm" color={stage === 3 ? 'success' : 'warning'}>
                  {stageName}
                </Badge>
              </div>
              <p className="t-sub">$48,000 a year · Closes 30 Oct 2026 · Owner Kemi Martins</p>
            </div>
          </div>
          <div className="t-actions">
            <Button variant="secondary" iconLeft={<Phone />} onClick={() => post('Kemi Martins logged a call with Ada Nwachukwu.')}>
              Log a call
            </Button>
            <Button variant="secondary" iconLeft={<EnvelopeSimple />} onClick={() => toast({ title: 'Email draft opened', description: 'To Ada Nwachukwu.' })}>
              Send email
            </Button>
            <Button iconLeft={<CheckCircle />} disabled={stage === 3} onClick={() => setWon(true)}>
              Mark as won
            </Button>
          </div>
        </header>

        <Stepper
          aria-label="Deal stage"
          current={stage}
          steps={[
            { title: 'Qualified', description: '2 Sep' },
            { title: 'Proposal', description: '19 Sep' },
            { title: 'Negotiation', description: stage === 2 ? 'Since 3 Oct' : '3 Oct' },
            { title: 'Won', description: stage === 3 ? 'Today' : 'Target 30 Oct' },
          ]}
        />

        <div className="t-split">
          <Tabs defaultValue="activity">
            <TabList aria-label="Deal">
              <Tab value="activity">Activity</Tab>
              <Tab value="notes">Notes</Tab>
              <Tab value="files">Files</Tab>
              <Tab value="emails">Emails</Tab>
            </TabList>
            <TabPanel value="activity">
              <div className="t-detail" style={{ marginTop: 'var(--halo-spacing-9)' }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!note.trim()) return;
                    post(note.trim());
                    setNote('');
                  }}
                >
                  <TextareaField aria-label="Note" placeholder="Write a note or @mention a teammate..." rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="t-actions" style={{ justifyContent: 'flex-end', marginTop: 'var(--halo-spacing-6)' }}>
                    <Button size="sm" type="submit" variant="secondary" disabled={!note.trim()}>
                      Add note
                    </Button>
                  </div>
                </form>
                <section className="t-panel" aria-label="Activity">
                  <ol className="v-feed">
                    {feed.map((f, i) => (
                      <li key={`${f.when}-${i}`}>
                        <Avatar src={f.who.src} name={f.who.name} size="sm" />
                        <span className="t-two-lines">
                          <span>{f.text}</span>
                          <span>{f.when}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </TabPanel>
            {['notes', 'files', 'emails'].map((v) => (
              <TabPanel key={v} value={v}>
                <EmptyState media={<Illustration name={v === 'files' ? 'no-files' : 'no-messages'} size={140} />} title={`No ${v} yet`} description="This example shows activity. The other tabs work the same way." />
              </TabPanel>
            ))}
          </Tabs>

          <div className="t-detail">
            <section className="t-panel" aria-labelledby="v-about">
              <h2 id="v-about">About this deal</h2>
              <dl className="k-summary">
                {[
                  ['Value', '$48,000 a year'],
                  ['Probability', <Badge key="p" size="sm" color="success">{stage === 3 ? '100%' : '70%'}</Badge>],
                  ['Close date', '30 Oct 2026'],
                  ['Source', 'Referral'],
                  ['Owner', 'Kemi Martins'],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="t-panel" aria-labelledby="v-people">
              <h2 id="v-people">People</h2>
              {team.map((p) => (
                <span key={p.id} className="t-person">
                  <Avatar src={p.src} name={p.name} size="md" />
                  <span className="t-two-lines">
                    <strong>{p.name}</strong>
                    <span>{roles[p.id]}</span>
                  </span>
                </span>
              ))}
            </section>
            <section className="t-panel" aria-labelledby="v-next">
              <h2 id="v-next">Next step</h2>
              <p style={{ margin: 0 }}>Send the updated contract to legal</p>
              <span className="t-person t-muted">
                <Badge size="sm" color="warning">
                  Due Mon 12 Oct
                </Badge>
                Assigned to you
              </span>
            </section>
          </div>
        </div>
      </div>

      <Modal
        open={won}
        onClose={() => setWon(false)}
        title="Mark Kestrel Bank as won?"
        description="It moves to Won and counts towards this quarter's numbers."
        actions={
          <>
            <Button variant="secondary" onClick={() => setWon(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setStage(3);
                setWon(false);
                post('Kemi Martins marked the deal as won.');
                toast({ type: 'success', title: 'Deal won', description: '$48,000 a year, Kestrel Bank.' });
              }}
            >
              Mark as won
            </Button>
          </>
        }
      />
    </Shell>
  );
}
