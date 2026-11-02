// Reviewing a pay run: untick anyone you don't want to pay. People without bank details can't be ticked. Totals follow the ticks.
import { useState } from 'react';
import type { Key } from 'react';
import { Alert, Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, DataTable, Modal, Statistic, Stepper, useToast } from '@halo-ds/react';
import type { BadgeColor, DataTableColumn } from '@halo-ds/react';
import { DownloadSimple } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { naira, netOf, staff } from './data';
import type { Employee, PayStatus } from './data';
import { Shell } from './Shell';

const payColor: Record<PayStatus, BadgeColor> = { Ready: 'success', 'New this month': 'information', 'No bank details': 'error' };

const columns: DataTableColumn<Employee>[] = [
  {
    key: 'name',
    header: 'Employee',
    render: (e) => (
      <span className="t-person">
        <Avatar src={e.src} name={e.name} size="sm" />
        <span className="t-two-lines">
          <span>{e.name}</span>
          <span>{e.role}</span>
        </span>
      </span>
    ),
  },
  { key: 'gross', header: 'Gross pay', align: 'right', render: (e) => naira(e.gross) },
  { key: 'paye', header: 'PAYE', align: 'right', render: (e) => naira(e.paye) },
  { key: 'pension', header: 'Pension', align: 'right', render: (e) => naira(e.pension) },
  { key: 'net', header: 'Net pay', align: 'right', render: (e) => <strong>{naira(netOf(e))}</strong> },
  {
    key: 'pay',
    header: 'Status',
    render: (e) => (
      <Badge size="sm" color={payColor[e.pay]}>
        {e.pay}
      </Badge>
    ),
  },
];

// The other 42 people on payroll, all ready, summed so the totals match a 48-person company
const others = { count: 42, net: 11_000_000, tax: 3_500_000 };

export default function Run() {
  const go = useNav();
  const { toast } = useToast();
  const payable = staff.filter((e) => e.pay !== 'No bank details');
  const [selected, setSelected] = useState<Key[]>(payable.map((e) => e.id));
  const [confirm, setConfirm] = useState(false);
  const blocked = staff.filter((e) => e.pay === 'No bank details');

  // Keep people without bank details out, even if they get ticked
  const pick = (ids: Key[]) => setSelected(ids.filter((id) => payable.some((e) => e.id === id)));
  const chosen = staff.filter((e) => selected.includes(e.id));
  const net = others.net + chosen.reduce((n, e) => n + netOf(e), 0);
  const tax = others.tax + chosen.reduce((n, e) => n + e.paye + e.pension, 0);

  return (
    <Shell current="run">
      <div className="t-page">
        <header className="t-head">
          <div>
            <Breadcrumbs size="sm">
              <BreadcrumbItem href="#" onClick={(e) => (e.preventDefault(), go('overview'))}>
                Pay runs
              </BreadcrumbItem>
              <BreadcrumbItem>October 2026</BreadcrumbItem>
            </Breadcrumbs>
            <h1 style={{ marginTop: 'var(--halo-spacing-4)' }}>Review October pay</h1>
            <p className="t-sub">Untick anyone you don&apos;t want to pay in this run.</p>
          </div>
          <Button variant="secondary" iconLeft={<DownloadSimple />} onClick={() => toast({ type: 'success', title: 'Pay run exported', description: 'October-2026.csv' })}>
            Export
          </Button>
        </header>

        <Stepper
          aria-label="Pay run"
          current={1}
          steps={[
            { title: 'Hours', description: 'Checked' },
            { title: 'Approve', description: 'Review pay' },
            { title: 'Fund', description: 'Top up account' },
            { title: 'Pay', description: 'On 23 Oct' },
          ]}
        />

        <Alert
          type="error"
          title={`${blocked.length} people can't be paid yet`}
          description={`${blocked.map((e) => e.name).join(' and ')} have no bank details. Add them, or pay them in the next run.`}
        />

        <DataTable aria-label="People in this run" columns={columns} rows={staff} getRowId={(e) => e.id} selectable selected={selected} onSelectedChange={pick} />

        <section className="t-panel s-account" aria-label="Totals">
          <div className="t-usage" style={{ flex: 1 }}>
            <Statistic label="Selected" value={`${others.count + chosen.length} of 48 people`} size="sm" />
            <Statistic label="Total net pay" value={naira(net)} size="sm" />
            <Statistic label="Tax and pension" value={naira(tax)} size="sm" />
          </div>
          <div className="t-actions">
            <Button size="lg" variant="secondary" onClick={() => toast({ type: 'success', title: 'Saved for later', description: 'Nothing is paid until you approve.' })}>
              Save for later
            </Button>
            <Button size="lg" disabled={!chosen.length} onClick={() => setConfirm(true)}>
              Approve and pay
            </Button>
          </div>
        </section>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Pay ${others.count + chosen.length} people ${naira(net)}?`}
        description="It leaves Kova Business ··4421 on Friday 23 October. You can cancel until then."
        actions={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirm(false);
                toast({ type: 'success', title: 'October pay approved', description: 'Payslips go out on pay day.' });
                go('overview');
              }}
            >
              Approve and pay
            </Button>
          </>
        }
      />
    </Shell>
  );
}
