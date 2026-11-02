// Arko's overview: this month's pay run, the funding account, the numbers, cost by month and team, and the people on payroll.
import { useState } from 'react';
import { Avatar, Badge, BarChart, Button, Card, CompactButton, DataTable, Input, LinkButton, Menu, ProgressBar, Statistic, Stepper, TableToolbar, useToast } from '@halo-ds/react';
import type { BadgeColor, DataTableColumn } from '@halo-ds/react';
import { CheckCircle, Clock, DotsThree, Funnel, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { costByMonth, costByTeam, naira, staff } from './data';
import type { Employee, StaffStatus } from './data';
import { Shell } from './Shell';

const statusColor: Record<StaffStatus, BadgeColor> = { Active: 'success', 'On leave': 'warning', 'Needs details': 'error' };

export default function Overview() {
  const go = useNav();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      sortable: true,
      sortValue: (e) => e.name,
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
    { key: 'team', header: 'Team', render: (e) => e.team },
    { key: 'gross', header: 'Monthly pay', align: 'right', sortable: true, sortValue: (e) => e.gross, render: (e) => naira(e.gross) },
    { key: 'bank', header: 'Bank', render: (e) => e.bank },
    {
      key: 'status',
      header: 'Status',
      filters: (Object.keys(statusColor) as StaffStatus[]).map((s) => ({ value: s, label: s })),
      onFilter: (e, v) => v.includes(e.status),
      render: (e) => (
        <Badge size="sm" color={statusColor[e.status]}>
          {e.status}
        </Badge>
      ),
    },
    {
      key: 'more',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (e) => (
        <Menu
          aria-label={`${e.name} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${e.name}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: 'View payslip', onSelect: () => go('payslip') },
            { label: 'Ask for bank details', disabled: e.bank !== 'Missing', onSelect: () => toast({ title: 'Request sent', description: `${e.name} gets an email to add their bank.` }) },
          ]}
        />
      ),
    },
  ];

  return (
    <Shell current="overview">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Payroll</h1>
            <p className="t-sub">Brightline Media Ltd · 48 people</p>
          </div>
          <Button variant="secondary" iconLeft={<Plus />} onClick={() => toast({ title: 'Add employee', description: 'Their name, role, pay and bank.' })}>
            Add employee
          </Button>
        </header>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="a-run">
            <div className="t-panel-head">
              <div>
                <h2 id="a-run">October pay run</h2>
                <p className="t-muted">Pay day: Friday 23 October</p>
              </div>
              <Badge size="sm" color="warning" icon={<Clock />}>
                Due in 13 days
              </Badge>
            </div>
            <div className="t-usage">
              <Statistic label="Total cost" value={naira(18420000)} />
              <Statistic label="Net pay to staff" value={naira(13950000)} />
              <Statistic label="Tax and deductions" value={naira(4470000)} />
            </div>
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
            <div className="t-actions">
              <Button size="lg" onClick={() => go('run')}>
                Review and approve
              </Button>
              <Button size="lg" variant="secondary" onClick={() => go('payslip')}>
                Preview payslips
              </Button>
            </div>
          </section>

          <section className="t-panel" aria-labelledby="a-fund">
            <div>
              <h2 id="a-fund">Funding account</h2>
              <p className="t-muted">Money for this run leaves from here</p>
            </div>
            <div className="k-who">
              <span className="k-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 30 30" style={{ fill: 'var(--halo-icon-primary)' }}>
                  <path d="M15 1 29 15 15 29 1 15Z M15 10 10 15 15 20 20 15Z" fillRule="evenodd" />
                </svg>
              </span>
              <span className="t-two-lines">
                <strong>Kova Business</strong>
                <span>Current account ··4421</span>
              </span>
            </div>
            <Statistic label="Available balance" value={naira(21300000)} />
            <span>
              <Badge size="sm" color="success" icon={<CheckCircle />}>
                Enough for this run
              </Badge>
            </span>
            <span>
              <LinkButton size="sm" onClick={() => toast({ title: 'Change account', description: 'Pick another business account.' })}>
                Change account
              </LinkButton>
            </span>
          </section>
        </div>

        <div className="t-stats">
          <Card>
            <Statistic label="People on payroll" value={48} change="+3" trend="up" sentiment="positive" comparison="joined this month" />
          </Card>
          <Card>
            <Statistic label="Average monthly pay" value={naira(290600)} comparison="Before tax" />
          </Card>
          <Card>
            <Statistic label="PAYE this month" value={naira(2610000)} comparison="Remit by 10 Nov" />
          </Card>
          <Card>
            <Statistic label="Pension this month" value={naira(1120000)} comparison="Employer and staff" />
          </Card>
        </div>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="a-month">
            <div>
              <h2 id="a-month">Payroll cost by month</h2>
              <p className="t-muted">Last 6 months</p>
            </div>
            <BarChart label="Payroll cost by month" data={costByMonth} xKey="m" series={[{ key: 'cost', label: 'Cost' }]} formatValue={(n) => `₦${n}M`} height={220} />
          </section>
          <section className="t-panel t-neutral" aria-labelledby="a-team">
            <div>
              <h2 id="a-team">Cost by team</h2>
              <p className="t-muted">October</p>
            </div>
            {costByTeam.map((t) => (
              <ProgressBar key={t.team} label={t.team} valueLabel={`₦${t.cost}M`} value={t.cost} max={18.4} size="sm" />
            ))}
          </section>
        </div>

        <DataTable
          aria-label="People"
          columns={columns}
          rows={staff.filter((e) => `${e.name} ${e.team}`.toLowerCase().includes(query.trim().toLowerCase()))}
          getRowId={(e) => e.id}
          pageSize={4}
          toolbar={
            <TableToolbar
              title="People"
              description="48 people on payroll"
              actions={
                <>
                  <Input size="sm" aria-label="Search people" placeholder="Search" iconLeft={<MagnifyingGlass />} value={query} onChange={(e) => setQuery(e.target.value)} />
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
