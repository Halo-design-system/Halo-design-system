// Receipts: every upload as a card, filtered by what needs a look. Open one to fix or confirm it.
import { useState } from 'react';
import { Badge, Button, DatePickerField, Drawer, FileUpload, InputField, Modal, Tab, TabList, Tabs, useToast } from '@halo-ds/react';
import type { BadgeColor } from '@halo-ds/react';
import { Receipt, UploadSimple } from '@phosphor-icons/react';
import { naira, receipts as start } from './data';
import type { ReceiptStatus } from './data';
import { Shell } from './Shell';

const statusColor: Record<ReceiptStatus, BadgeColor> = { 'Needs a look': 'warning', 'Missing date': 'error', Verified: 'success' };

export default function Receipts() {
  const { toast } = useToast();
  const [receipts, setReceipts] = useState(start);
  const [tab, setTab] = useState('look');
  const [open, setOpen] = useState<string | null>(null);
  const [upload, setUpload] = useState(false);
  const current = receipts.find((r) => r.id === open);
  const needs = receipts.filter((r) => r.status !== 'Verified');
  const shown = tab === 'all' ? receipts : tab === 'look' ? needs : receipts.filter((r) => r.status === 'Verified');

  const verify = (id: string) => {
    setReceipts(receipts.map((r) => (r.id === id ? { ...r, status: 'Verified' } : r)));
    setOpen(null);
    toast({ type: 'success', title: 'Receipt verified', description: 'It counts towards your deductions now.' });
  };

  return (
    <Shell current="receipts">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Receipts</h1>
            <p className="t-sub">24 this year · ₦1,180,000 in deductions</p>
          </div>
          <Button iconLeft={<UploadSimple />} onClick={() => setUpload(true)}>
            Upload receipts
          </Button>
        </header>

        <Tabs value={tab} onValueChange={setTab}>
          <TabList aria-label="Receipts">
            <Tab value="all">All</Tab>
            <Tab value="look" badge={needs.length ? <Badge size="sm" color="neutral" count={needs.length} /> : undefined}>
              Needs a look
            </Tab>
            <Tab value="verified">Verified</Tab>
          </TabList>
        </Tabs>

        <div className="z-receipts">
          {shown.map((r) => (
            <button key={r.id} type="button" className="z-receipt" onClick={() => setOpen(r.id)}>
              <span className="z-receipt-image" aria-hidden="true">
                <Receipt />
              </span>
              <span className="k-row">
                <strong>{r.name}</strong>
                <strong>{naira(r.amount)}</strong>
              </span>
              <span className="k-row">
                <span className="t-muted">{r.date}</span>
                <Badge size="sm" color={statusColor[r.status]}>
                  {r.status}
                </Badge>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Drawer
        open={!!current}
        onClose={() => setOpen(null)}
        title={current?.name ?? ''}
        description={current ? `${naira(current.amount)} · ${current.status}` : undefined}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(null)}>
              Close
            </Button>
            <Button disabled={current?.status === 'Verified'} onClick={() => current && verify(current.id)}>
              Confirm receipt
            </Button>
          </>
        }
      >
        {current && (
          <div className="t-detail">
            <span className="z-receipt-image" style={{ height: 200 }} aria-hidden="true">
              <Receipt />
            </span>
            <InputField label="What it was for" placeholder="Laptop" defaultValue={current.name} />
            <InputField label="Amount" placeholder="₦0" defaultValue={naira(current.amount)} />
            <DatePickerField label="Date" placeholder="Pick a date" error={current.status === 'Missing date' ? 'Add the date on the receipt.' : undefined} />
          </div>
        )}
      </Drawer>

      <Modal open={upload} onClose={() => setUpload(false)} title="Upload receipts" description="PDF or photo, up to 10 MB each. We read the amount and date for you.">
        <FileUpload
          multiple
          accept=".pdf,.png,.jpg"
          maxSize={10_000_000}
          title="Drag files here"
          description="PNG, JPG or PDF, up to 10 MB"
          buttonLabel="Browse files"
          onFiles={(files) => {
            setReceipts([...files.map((f, i) => ({ id: `u${Date.now()}${i}`, name: f.name.replace(/\.\w+$/, ''), date: '16 Oct 2026', amount: 0, status: 'Needs a look' as const })), ...receipts]);
            setUpload(false);
            setTab('look');
            toast({ type: 'success', title: `${files.length} receipt${files.length === 1 ? '' : 's'} uploaded` });
          }}
        />
      </Modal>
    </Shell>
  );
}
