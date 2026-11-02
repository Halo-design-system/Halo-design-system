// A new prescription. It checks the medicine against the patient's allergies and pregnancy as you pick it.
import { useState } from 'react';
import { Alert, Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, InputField, NumberInput, SelectField, Switch, TextareaField, useToast } from '@halo-ds/react';
import { useNav } from '../kit';
import { me, patients } from './data';
import { Shell } from './Shell';

const medicines = [
  { value: 'ferrous', label: 'Ferrous sulphate 200 mg tablets', short: 'Ferrous sulphate 200 mg', safe: true },
  { value: 'folic', label: 'Folic acid 5 mg tablets', short: 'Folic acid 5 mg', safe: true },
  { value: 'amoxicillin', label: 'Amoxicillin 500 mg capsules', short: 'Amoxicillin 500 mg', safe: false },
];
const often = [
  { value: 'once', label: 'Once a day', short: 'once a day' },
  { value: 'twice', label: 'Twice a day, with food', short: 'twice a day' },
  { value: 'three', label: 'Three times a day', short: 'three times a day' },
];

export default function Prescribe() {
  const go = useNav();
  const { toast } = useToast();
  const [medicine, setMedicine] = useState('ferrous');
  const [dose, setDose] = useState('1 tablet');
  const [how, setHow] = useState('twice');
  const [days, setDays] = useState(30);
  const [refills, setRefills] = useState(1);
  const [note, setNote] = useState('Take with orange juice, not tea. Dark stools are normal.');
  const [pharmacy, setPharmacy] = useState(true);
  const p = patients.halima;
  const med = medicines.find((m) => m.value === medicine)!;
  const freq = often.find((o) => o.value === how)!;

  return (
    <Shell current="patient">
      <div className="t-page">
        <header>
          <Breadcrumbs size="sm">
            <BreadcrumbItem href="#" onClick={(e) => (e.preventDefault(), go('patient'))}>
              {p.name}
            </BreadcrumbItem>
            <BreadcrumbItem>New prescription</BreadcrumbItem>
          </Breadcrumbs>
          <div className="t-head" style={{ marginTop: 'var(--halo-spacing-4)' }}>
            <h1>New prescription</h1>
          </div>
        </header>

        <section className="t-panel s-account" aria-label="Patient">
          <span className="t-person">
            <Avatar src={p.src} name={p.name} size="md" />
            <span className="t-two-lines">
              <strong>{p.name}</strong>
              <span>29 years · Pregnant, 28 weeks · 71 kg</span>
            </span>
          </span>
          <Badge size="sm" color="error">
            Allergic to penicillin
          </Badge>
        </section>

        <div className="k-send">
          <section className="t-panel" aria-label="Medicine">
            <SelectField label="Medicine" value={medicine} onValueChange={setMedicine} options={medicines.map(({ value, label }) => ({ value, label }))} />
            <div className="k-pair">
              <InputField label="Dose" placeholder="1 tablet" value={dose} onChange={(e) => setDose(e.target.value)} />
              <SelectField label="How often" value={how} onValueChange={setHow} options={often.map(({ value, label }) => ({ value, label }))} />
            </div>
            <div className="k-pair">
              <NumberInput label="For (days)" min={1} max={180} value={days} onValueChange={setDays} />
              <NumberInput label="Refills" min={0} max={6} value={refills} onValueChange={setRefills} hint={refills ? `${refills} more pack${refills > 1 ? 's' : ''} after ${days} days` : 'No refills'} />
            </div>
            <TextareaField label="Note for the patient" placeholder="Take with food" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            <Switch label="Send to her pharmacy" description="MedPlus, Admiralty Way, Lekki" controlPosition="end" checked={pharmacy} onCheckedChange={setPharmacy} />
          </section>

          <section className="t-panel" aria-labelledby="n-rx">
            <h2 id="n-rx">Prescription</h2>
            <dl className="k-summary">
              {[
                ['Patient', p.name],
                ['Medicine', med.short],
                ['Take', `${dose}, ${freq.short}`],
                ['For', `${days} days, ${refills} refill${refills === 1 ? '' : 's'}`],
                ['Prescriber', me.name],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {med.safe ? (
              <Alert type="success" size="sm" title="Safe in pregnancy. No clash with her allergies or medicines." />
            ) : (
              <Alert type="error" size="sm" title="Amoxicillin is a penicillin. Halima is allergic to penicillin." />
            )}
            <Button
              size="lg"
              disabled={!med.safe}
              onClick={() => {
                toast({ type: 'success', title: 'Prescription sent', description: pharmacy ? 'MedPlus Lekki has it now.' : 'Halima can pick it up from any pharmacy.' });
                go('patient');
              }}
            >
              Sign and send
            </Button>
          </section>
        </div>
      </div>
    </Shell>
  );
}
