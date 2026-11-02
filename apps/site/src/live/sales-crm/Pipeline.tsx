// The deals board, and the drawer for adding a deal. A new deal lands in Qualified.
import { useState } from 'react';
import { Avatar, Button, DatePicker, Drawer, Field, InputField, SelectField, Tag, useToast } from '@halo-ds/react';
import { Plus } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { contacts, deals as start, people, stages } from './data';
import type { Deal } from './data';
import { DealCard } from './DealCard';
import { Shell } from './Shell';

const companies = ['Solin Media', 'Brightline', 'Nimbo Market', 'Zephra Energy'];

function AddDeal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (d: Deal) => void }) {
  const [name, setName] = useState('Solin Media, team plan');
  const [company, setCompany] = useState(companies[0]!);
  const [value, setValue] = useState('36000');
  const [close, setClose] = useState<Date | null>(new Date(2026, 11, 15));
  const [owner, setOwner] = useState('kemi');
  const [people_, setPeople] = useState(['temi', 'amara']);
  const [tried, setTried] = useState(false);
  const invalid = !name.trim();

  const save = () => {
    setTried(true);
    if (invalid) return;
    const rep = people[owner as keyof typeof people];
    onAdd({
      id: `d${Date.now()}`,
      company,
      value: Number(value.replace(/\D/g, '')) || 0,
      stage: 'Qualified',
      closes: close ? `Closes ${close.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : 'No close date',
      team: [rep],
      contact: contacts.find((c) => c.id === people_[0]) ?? contacts[0]!,
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add a deal"
      description="It lands in Qualified. You can move it later."
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Add deal</Button>
        </>
      }
    >
      <div className="t-detail">
        <InputField label="Deal name" placeholder="Solin Media, team plan" value={name} onChange={(e) => setName(e.target.value)} error={tried && invalid ? 'Give the deal a name.' : undefined} />
        <SelectField label="Company" value={company} onValueChange={setCompany} options={companies.map((c) => ({ value: c, label: c }))} />
        <div className="k-pair">
          <InputField label="Value a year" placeholder="36,000" inputMode="numeric" iconLeft={<span aria-hidden="true">$</span>} value={Number(value.replace(/\D/g, '') || 0).toLocaleString('en-US')} onChange={(e) => setValue(e.target.value)} />
          <Field label="Close date">{(c) => <DatePicker {...c} value={close} onValueChange={setClose} />}</Field>
        </div>
        <SelectField label="Owner" value={owner} onValueChange={setOwner} options={Object.entries(people).map(([id, p]) => ({ value: id, label: p.name }))} />
        <Field label="Contacts">
          {() => (
            <div className="demo-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--halo-spacing-4)' }}>
              {people_.map((id) => {
                const c = contacts.find((x) => x.id === id)!;
                return (
                  <Tag key={id} avatar={<Avatar src={c.src} name={c.name} size="xs" />} onRemove={() => setPeople(people_.filter((x) => x !== id))} removeLabel={`Remove ${c.name}`}>
                    {c.name}
                  </Tag>
                );
              })}
            </div>
          )}
        </Field>
      </div>
    </Drawer>
  );
}

/** The board. `adding` opens the Add a deal drawer straight away. */
export function Board({ adding = false }: { adding?: boolean }) {
  const go = useNav();
  const { toast } = useToast();
  const [deals, setDeals] = useState(start);
  const [open, setOpen] = useState(adding);
  const total = deals.filter((d) => d.stage !== 'Won').reduce((n, d) => n + d.value, 0);

  return (
    <Shell current="pipeline">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Pipeline</h1>
            <p className="t-sub">
              {deals.filter((d) => d.stage !== 'Won').length + 18} open deals · ${((total + 1000000) / 1000000).toFixed(2)}M
            </p>
          </div>
          <Button iconLeft={<Plus />} onClick={() => setOpen(true)}>
            Add deal
          </Button>
        </header>
        <div className="v-stages">
          {stages.map((s) => (
            <section key={s} className="t-column" aria-label={s}>
              <div className="v-stage-head">{s}</div>
              {deals
                .filter((d) => d.stage === s)
                .map((d) => (
                  <DealCard key={d.id} deal={d} showContact onOpen={() => go('deal')} />
                ))}
            </section>
          ))}
        </div>
      </div>
      <AddDeal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={(d) => {
          setDeals([d, ...deals]);
          setOpen(false);
          toast({ type: 'success', title: 'Deal added', description: `${d.company} is in Qualified.` });
        }}
      />
    </Shell>
  );
}

export default function Pipeline() {
  return <Board />;
}
