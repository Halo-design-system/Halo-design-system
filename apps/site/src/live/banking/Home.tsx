// Kova's home: balance and wallets, spending against budget, cash flow, savings goals and recent transactions.
import { useState } from "react";
import type { ReactElement } from "react";
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  CompactButton,
  DataTable,
  Input,
  LinkButton,
  Menu,
  ProgressBar,
  ProgressCircle,
  SegmentedControl,
  Select,
  TableToolbar,
  useToast,
} from "@halo-ds/react";
import type { BadgeColor, DataTableColumn } from "@halo-ds/react";
import {
  ArrowDownLeft,
  ArrowsClockwise,
  ArrowUpRight,
  Car,
  DotsThree,
  Eye,
  EyeSlash,
  FilmSlate,
  ForkKnife,
  Funnel,
  Lightning,
  MagnifyingGlass,
  PaperPlaneTilt,
  Plus,
  Receipt,
  ShoppingCart,
  TrendUp,
} from "@phosphor-icons/react";
import { useNav } from "../kit";
import {
  cashFlow,
  day,
  goals,
  me,
  naira,
  spending,
  transactions,
  wallets,
} from "./data";
import type { TxStatus } from "./data";
import { Shell } from "./Shell";

const icons: Record<string, ReactElement> = {
  food: <ForkKnife />,
  transport: <Car />,
  bills: <Lightning />,
  shopping: <ShoppingCart />,
  fun: <FilmSlate />,
};
const statusColor: Record<TxStatus, BadgeColor> = {
  Completed: "success",
  Pending: "warning",
  Failed: "error",
};
type Tx = (typeof transactions)[number];

export default function Home() {
  const go = useNav();
  const { toast } = useToast();
  const [hidden, setHidden] = useState(false);
  const [range, setRange] = useState("months");
  const [currency, setCurrency] = useState("ngn");
  const [query, setQuery] = useState("");
  const total = 4250800;
  const money = (n: number, f = naira) => (hidden ? "••••••" : f(n));

  const columns: DataTableColumn<Tx>[] = [
    {
      key: "who",
      header: "Transaction",
      render: (t) => (
        <span className="t-person">
          <Avatar src={t.src} name={t.who} size="sm" />
          <span className="t-two-lines">
            <span>{t.who}</span>
            <span>{t.what}</span>
          </span>
        </span>
      ),
    },
    { key: "category", header: "Category", render: (t) => t.category },
    {
      key: "date",
      header: "Date",
      sortable: true,
      sortValue: (t) => t.date.getTime(),
      render: (t) => day(t.date),
    },
    {
      key: "status",
      header: "Status",
      filters: (["Completed", "Pending", "Failed"] as TxStatus[]).map((s) => ({
        value: s,
        label: s,
      })),
      onFilter: (t, v) => v.includes(t.status),
      render: (t) => (
        <Badge size="sm" color={statusColor[t.status]}>
          {t.status}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortable: true,
      sortValue: (t) => t.amount,
      render: (t) => (
        <span className={t.amount > 0 ? "k-in" : undefined}>
          {t.amount > 0 ? `+${naira(t.amount)}` : naira(t.amount)}
        </span>
      ),
    },
    {
      key: "more",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      render: (t) => (
        <Menu
          aria-label={`${t.who} actions`}
          trigger={
            <CompactButton variant="ghost" aria-label={`More for ${t.who}`}>
              <DotsThree />
            </CompactButton>
          }
          items={[
            {
              label: "Download receipt",
              onSelect: () =>
                toast({ type: "success", title: "Receipt downloaded" }),
            },
            {
              label: "Report a problem",
              onSelect: () =>
                toast({
                  title: "We got your report",
                  description: "Our team will reply within a day.",
                }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Shell current="home">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Good morning, {me.first}</h1>
            <p className="t-sub">Your money at a glance.</p>
          </div>
          <div className="t-actions">
            <div className="t-fit">
              <Select
                aria-label="Currency"
                value={currency}
                onValueChange={setCurrency}
                options={[
                  { value: "ngn", label: "NGN" },
                  { value: "usd", label: "USD" },
                ]}
              />
            </div>
            <Button
              variant="secondary"
              iconLeft={<Plus />}
              onClick={() =>
                toast({
                  title: "Add money",
                  description:
                    "Transfer to your Kova account number 2281 0044 21.",
                })
              }
            >
              Add money
            </Button>
            <Button iconLeft={<PaperPlaneTilt />} onClick={() => go("send")}>
              Send money
            </Button>
          </div>
        </header>

        <div className="t-split">
          <section className="t-panel" aria-label="Balance">
            <div className="t-person t-muted">
              Total balance
              <CompactButton
                variant="ghost"
                size="md"
                aria-label={hidden ? "Show balance" : "Hide balance"}
                onClick={() => setHidden(!hidden)}
              >
                {hidden ? <EyeSlash /> : <Eye />}
              </CompactButton>
            </div>
            <div className="k-balance">
              <strong>
                {money(
                  currency === "usd" ? total / 1540 : total,
                  currency === "usd"
                    ? (n) =>
                        `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
                    : naira,
                )}
              </strong>
              <Badge size="sm" color="success" icon={<TrendUp />}>
                +3.2% this month
              </Badge>
            </div>
            <div className="t-actions">
              <Button
                size="sm"
                variant="secondary"
                iconLeft={<ArrowUpRight />}
                onClick={() => go("send")}
              >
                Send
              </Button>
              <Button
                size="sm"
                variant="secondary"
                iconLeft={<ArrowDownLeft />}
                onClick={() =>
                  toast({
                    title: "Request link copied",
                    description: "Share it and get paid to your Naira wallet.",
                  })
                }
              >
                Request
              </Button>
              <Button
                size="sm"
                variant="secondary"
                iconLeft={<ArrowsClockwise />}
                onClick={() => go("wallets")}
              >
                Exchange
              </Button>
              <Button
                size="sm"
                variant="secondary"
                iconLeft={<Receipt />}
                onClick={() => go("bills")}
              >
                Pay bills
              </Button>
            </div>
            <div className="k-tiles">
              {wallets.map((w) => (
                <div key={w.id} className="k-tile">
                  <span className="t-muted">{w.name}</span>
                  <strong>{money(w.balance, w.money)}</strong>
                  <span className="t-muted">{w.detail}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="t-panel" aria-labelledby="k-spend">
            <div className="t-panel-head">
              <div>
                <h2 id="k-spend">Spending this month</h2>
                <p className="t-muted">₦312,400 of ₦450,000 budget</p>
              </div>
              <LinkButton size="sm">Budgets</LinkButton>
            </div>
            <div className="k-spend t-neutral">
              {spending.map((s) => {
                const over = s.spent / s.budget > 0.95;
                return (
                  <div key={s.id} className="k-spend-row">
                    <span
                      className={`k-icon${over ? " k-icon-alert" : ""}`}
                      aria-hidden="true"
                    >
                      {icons[s.id]}
                    </span>
                    <ProgressBar
                      label={s.name}
                      valueLabel={naira(s.spent, false)}
                      value={s.spent}
                      max={s.budget}
                      status={over ? "error" : "default"}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="k-flow">
            <div className="t-panel-head">
              <div>
                <h2 id="k-flow">Cash flow</h2>
                <p className="t-muted">Money in and out each month</p>
              </div>
              <SegmentedControl
                aria-label="Period"
                size="sm"
                value={range}
                onValueChange={setRange}
                options={[
                  { value: "months", label: "6 months" },
                  { value: "year", label: "1 year" },
                ]}
              />
            </div>
            <BarChart
              label="Money in and out"
              data={range === "months" ? cashFlow.months : cashFlow.year}
              xKey="m"
              series={[
                { key: "in", label: "Money in" },
                { key: "out", label: "Money out" },
              ]}
              formatValue={(n) => `₦${n}k`}
              height={220}
              legend
            />
          </section>

          <section className="t-panel t-neutral" aria-labelledby="k-goals">
            <div className="t-panel-head">
              <div>
                <h2 id="k-goals">Savings goals</h2>
                <p className="t-muted">3 goals in progress</p>
              </div>
              <LinkButton
                size="sm"
                onClick={() =>
                  toast({
                    title: "New goal",
                    description: "Pick a name and a target to start saving.",
                  })
                }
              >
                Add goal
              </LinkButton>
            </div>
            {goals.map((g) => (
              <button
                key={g.id}
                type="button"
                className="k-goal"
                onClick={() => go("goal")}
              >
                <ProgressCircle
                  value={Math.round((g.saved / g.target) * 100)}
                  showValue
                  size="md"
                  aria-label={`${g.name}, saved`}
                />
                <span className="t-two-lines">
                  <strong>{g.name}</strong>
                  <span>
                    {naira(g.saved, false)} of {naira(g.target, false)}
                  </span>
                </span>
              </button>
            ))}
          </section>
        </div>

        <DataTable
          aria-label="Recent transactions"
          columns={columns}
          rows={transactions.filter((t) =>
            t.who.toLowerCase().includes(query.trim().toLowerCase()),
          )}
          getRowId={(t) => t.id}
          pageSize={5}
          toolbar={
            <TableToolbar
              title="Recent transactions"
              description="Last 30 days"
              actions={
                <>
                  <Input
                    size="sm"
                    aria-label="Search transactions"
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
