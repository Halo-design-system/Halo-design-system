// Send money: pick a wallet and someone, check the summary, then confirm with your PIN.
import { useState } from 'react';
import { Avatar, Badge, Button, Field, InputField, Modal, SegmentedControl, Select, SelectField, VerificationCode, useToast } from '@halo-ds/react';
import { Bank, CheckCircle, LockSimple, Plus } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { banks, contacts, naira, wallets } from './data';
import { Shell } from './Shell';

export default function Send() {
  const go = useNav();
  const { toast } = useToast();
  const [from, setFrom] = useState('ngn');
  const [to, setTo] = useState(contacts[0]!.id);
  const [kind, setKind] = useState('bank');
  const [bank, setBank] = useState(contacts[0]!.bank);
  const [account, setAccount] = useState(contacts[0]!.account);
  const [amount, setAmount] = useState('25000');
  const [note, setNote] = useState('Rent share for October');
  const [pin, setPin] = useState(false);

  const person = contacts.find((c) => c.account === account && c.bank === bank);
  const value = Number(amount.replace(/[^\d.]/g, '')) || 0;
  const wallet = wallets.find((w) => w.id === from)!;
  const tooMuch = value > wallet.balance;
  const ready = person && value > 0 && !tooMuch;

  const pick = (id: string) => {
    const c = contacts.find((x) => x.id === id)!;
    setTo(id);
    setBank(c.bank);
    setAccount(c.account);
  };

  return (
    <Shell current="send">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Send money</h1>
            <p className="t-sub">To a Kova user or any Nigerian bank account.</p>
          </div>
        </header>

        <div className="k-send">
          <section className="t-panel" aria-label="Payment details">
            <SelectField
              label="From"
              value={from}
              onValueChange={setFrom}
              options={wallets.filter((w) => w.id !== 'savings').map((w) => ({ value: w.id, label: `${w.name} · ${w.money(w.balance)}` }))}
            />

            <Field label="Recent">
              {() => (
                <div className="k-people">
                  {contacts.map((c) => (
                    <button key={c.id} type="button" className="k-person" aria-pressed={to === c.id && !!person} onClick={() => pick(c.id)}>
                      <Avatar src={c.src} name={c.name} size="md" />
                      {c.first}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="k-person"
                    aria-pressed={!person}
                    onClick={() => {
                      setTo('');
                      setAccount('');
                    }}
                  >
                    <Avatar icon={<Plus />} size="md" aria-hidden="true" />
                    New
                  </button>
                </div>
              )}
            </Field>

            <SegmentedControl aria-label="Send to" fullWidth value={kind} onValueChange={setKind} options={[{ value: 'bank', label: 'Bank account' }, { value: 'kova', label: 'Kova user' }]} />

            {kind === 'bank' ? (
              <div className="k-pair">
                <SelectField label="Bank" icon={<Bank />} value={bank} onValueChange={setBank} options={banks} />
                <InputField
                  label="Account number"
                  placeholder="0123456789"
                  inputMode="numeric"
                  maxLength={10}
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, ''))}
                  valid={!!person}
                  hint={person ? person.name : account.length === 10 ? 'No account found. Check the number.' : '10 digits'}
                />
              </div>
            ) : (
              <InputField label="Kova username" placeholder="@emeka" hint="Kova users get it instantly, with no fee." />
            )}

            <InputField
              label="Amount"
              placeholder="₦0"
              inputMode="numeric"
              value={value ? `₦${value.toLocaleString('en-NG')}` : ''}
              onChange={(e) => setAmount(e.target.value)}
              error={tooMuch ? `You have ${naira(wallet.balance)} in this wallet.` : undefined}
              hint={tooMuch ? undefined : `You have ${naira(wallet.balance)} in this wallet`}
            />
            <InputField label="Note" optional placeholder="Rent share for October" value={note} onChange={(e) => setNote(e.target.value)} />
          </section>

          <section className="t-panel" aria-labelledby="k-summary">
            <h2 id="k-summary">Summary</h2>
            {person ? (
              <div className="k-who">
                <Avatar src={person.src} name={person.name} size="md" />
                <span className="t-two-lines">
                  <strong>{person.name}</strong>
                  <span>
                    {banks.find((b) => b.value === person.bank)!.label} ··{person.account.slice(-4)}
                  </span>
                </span>
              </div>
            ) : (
              <p className="t-muted">Pick someone, or enter their bank and account number.</p>
            )}
            <dl className="k-summary">
              <div>
                <dt>You send</dt>
                <dd>{naira(value)}</dd>
              </div>
              <div>
                <dt>Fee</dt>
                <dd>
                  <Badge size="sm" color="success">
                    Free
                  </Badge>{' '}
                  {naira(0)}
                </dd>
              </div>
              <div>
                <dt>Arrives</dt>
                <dd>In seconds</dd>
              </div>
              <div className="k-total">
                <dt>{person ? `${person.first} gets` : 'They get'}</dt>
                <dd>{naira(value)}</dd>
              </div>
            </dl>
            <Button size="lg" disabled={!ready} onClick={() => setPin(true)}>
              Send {naira(value, false)}
            </Button>
            <p className="t-muted t-person" style={{ justifyContent: 'center' }}>
              <LockSimple aria-hidden="true" /> You confirm with your PIN on the next step
            </p>
          </section>
        </div>
      </div>

      <Modal
        open={pin}
        onClose={() => setPin(false)}
        title="Enter your PIN"
        description={`Send ${naira(value)} to ${person?.name ?? 'them'}.`}
        actions={
          <Button variant="secondary" onClick={() => setPin(false)}>
            Cancel
          </Button>
        }
      >
        <VerificationCode
          length={4}
          aria-label="PIN"
          onComplete={() => {
            setPin(false);
            toast({ type: 'success', title: `${naira(value)} sent`, description: `${person?.first} has it now.`, icon: <CheckCircle weight="fill" /> });
            go('home');
          }}
        />
        <p className="t-muted">Any 4 digits work in this example.</p>
      </Modal>
    </Shell>
  );
}
