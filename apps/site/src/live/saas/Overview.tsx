// Tessel's home: this month's numbers, active users, recent activity and the projects table.
import { useState } from "react";
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CompactButton,
  DataTable,
  DateRangePicker,
  Input,
  LinkButton,
  Menu,
  ProgressBar,
  SegmentedControl,
  Statistic,
  useToast,
  TableToolbar,
} from "@halo-ds/react";
import type { BadgeColor, DataTableColumn, DateRange } from "@halo-ds/react";
import {
  DotsThree,
  DownloadSimple,
  Funnel,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { useNav } from "../kit";
import { activeUsers, activity, projects } from "./data";
import { Shell } from "./Shell";

const statusColor: Record<string, BadgeColor> = {
  "In review": "warning",
  "On track": "success",
  "At risk": "error",
  "Not started": "neutral",
};
const day = (d: Date) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type Project = (typeof projects)[number];

export default function Overview() {
  const go = useNav();
  const { toast } = useToast();
  const [range, setRange] = useState<DateRange | null>([
    new Date(2026, 9, 1),
    new Date(2026, 9, 31),
  ]);
  const [period, setPeriod] = useState("month");
  const [query, setQuery] = useState("");

  const columns: DataTableColumn<Project>[] = [
    {
      key: "name",
      header: "Project",
      sortable: true,
      sortValue: (p) => p.name,
      render: (p) => (
        <span className="t-two-lines">
          <span>{p.name}</span>
          <span>{p.about}</span>
        </span>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (p) => (
        <span className="t-person">
          <Avatar src={p.owner.src} name={p.owner.name} size="sm" />
          <span className="t-two-lines">
            <span>{p.owner.name}</span>
            <span>{p.owner.team}</span>
          </span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      filters: Object.keys(statusColor).map((s) => ({ value: s, label: s })),
      onFilter: (p, values) => values.includes(p.status),
      render: (p) => (
        <Badge size="sm" color={statusColor[p.status]}>
          {p.status}
        </Badge>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      sortable: true,
      sortValue: (p) => p.progress,
      render: (p) => (
        <span className="t-progress">
          <ProgressBar
            value={p.progress}
            size="sm"
            aria-label={`${p.name} progress`}
          />
        </span>
      ),
    },
    {
      key: "due",
      header: "Due date",
      sortable: true,
      sortValue: (p) => p.due.getTime(),
      render: (p) => day(p.due),
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      render: (p) => (
        <Menu
          aria-label={`${p.name} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${p.name}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            { label: "Open board", onSelect: () => go("project") },
            {
              label: "Copy link",
              onSelect: () => toast({ type: "success", title: "Link copied" }),
            },
            { type: "separator" },
            {
              label: "Archive",
              destructive: true,
              onSelect: () => toast({ title: `${p.name} archived` }),
            },
          ]}
        />
      ),
    },
  ];

  const shown = projects.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Shell current="overview">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Overview</h1>
            <p className="t-sub">Here is how your workspace did this month.</p>
          </div>
          <div className="t-actions">
            <div className="t-dates">
              <DateRangePicker
                aria-label="Dates"
                value={range}
                onValueChange={setRange}
              />
            </div>
            <Button
              variant="secondary"
              iconLeft={<DownloadSimple />}
              onClick={() =>
                toast({
                  type: "success",
                  title: "Report exported",
                  description: "Overview, 1 to 31 Oct 2026.",
                })
              }
            >
              Export
            </Button>
            <Button iconLeft={<Plus />} onClick={() => go("project")}>
              New project
            </Button>
          </div>
        </header>

        <div className="t-stats">
          <Card>
            <Statistic
              label="Active users"
              value={12480}
              change="+12.4%"
              trend="up"
              sentiment="positive"
              comparison="vs last month"
            />
          </Card>
          <Card>
            <Statistic
              label="New sign-ups"
              value={1284}
              change="+8.1%"
              trend="up"
              sentiment="positive"
              comparison="vs last month"
            />
          </Card>
          <Card>
            <Statistic
              label="Churn rate"
              value={2.3}
              precision={1}
              suffix="%"
              change="-0.4%"
              trend="down"
              sentiment="positive"
              comparison="vs last month"
            />
          </Card>
          <Card>
            <Statistic
              label="Monthly revenue"
              value={48920}
              prefix="$"
              change="+5.6%"
              trend="up"
              sentiment="positive"
              comparison="vs last month"
            />
          </Card>
        </div>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="t-users">
            <div className="t-panel-head">
              <div>
                <h2 id="t-users">Active users</h2>
                <p className="t-muted">People who used the app at least once</p>
              </div>
              <SegmentedControl
                aria-label="Period"
                size="sm"
                value={period}
                onValueChange={setPeriod}
                options={[
                  { value: "week", label: "Week" },
                  { value: "month", label: "Month" },
                  { value: "year", label: "Year" },
                ]}
              />
            </div>
            <BarChart
              label="Active users by month"
              data={activeUsers}
              xKey="month"
              series={[{ key: "users", label: "Active users" }]}
              height={240}
            />
          </section>

          <section className="t-panel" aria-labelledby="t-activity">
            <div className="t-panel-head">
              <h2 id="t-activity">Recent activity</h2>
              <LinkButton size="sm">View all</LinkButton>
            </div>
            <ul className="t-activity">
              {activity.map((a) => (
                <li key={a.what}>
                  <Avatar src={a.who.src} name={a.who.name} size="sm" />
                  <span className="t-two-lines">
                    <span>
                      {a.who.name} {a.what}
                    </span>
                    <span>{a.when}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <DataTable
          aria-label="Projects"
          columns={columns}
          rows={shown}
          getRowId={(p) => p.id}
          pageSize={5}
          toolbar={
            <TableToolbar
              title="Projects"
              description="8 active projects across 4 teams"
              actions={
                <>
                  <Input
                    size="sm"
                    aria-label="Search projects"
                    placeholder="Search"
                    iconLeft={<MagnifyingGlass />}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
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
