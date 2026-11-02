// A savings goal: how far along it is, automatic saving, and every deposit and withdrawal.
import { useState } from "react";
import {
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  DataTable,
  InputField,
  LinkButton,
  Modal,
  ProgressCircle,
  SelectField,
  Switch,
  TableToolbar,
  useToast,
} from "@halo-ds/react";
import type { BadgeColor, DataTableColumn } from "@halo-ds/react";
import { Plus, TrendUp } from "@phosphor-icons/react";
import { useNav } from "../kit";
import { day, goalHistory, naira } from "./data";
import { Shell } from "./Shell";

type Row = (typeof goalHistory)[number];
const typeColor: Record<Row["type"], BadgeColor> = {
  Deposit: "success",
  Interest: "neutral",
  Withdrawal: "warning",
};
const target = 1200000;

const columns: DataTableColumn<Row>[] = [
  { key: "what", header: "What", render: (r) => r.what },
  {
    key: "date",
    header: "Date",
    sortable: true,
    sortValue: (r) => r.date.getTime(),
    render: (r) => day(r.date),
  },
  {
    key: "type",
    header: "Type",
    render: (r) => (
      <Badge size="sm" color={typeColor[r.type]}>
        {r.type}
      </Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (r) =>
      r.amount > 0 ? `+${naira(r.amount, false)}` : naira(r.amount, false),
  },
];

export default function Goal() {
  const go = useNav();
  const { toast } = useToast();
  const [history, setHistory] = useState(goalHistory);
  const [saved, setSaved] = useState(900000);
  const [auto, setAuto] = useState(true);
  const [plan, setPlan] = useState({ amount: 25000, day: "Friday" });
  const [dialog, setDialog] = useState<"add" | "withdraw" | "plan" | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const pct = Math.round((saved / target) * 100);

  const move = (sign: 1 | -1) => {
    const n = Number(amount.replace(/\D/g, ""));
    if (!n) return;
    setSaved(saved + sign * n);
    setHistory([
      {
        id: `h${history.length + 1}`,
        what: sign > 0 ? "Top up" : "Withdrawal",
        date: new Date(2026, 9, 16),
        type: sign > 0 ? "Deposit" : "Withdrawal",
        amount: sign * n,
      },
      ...history,
    ]);
    toast({
      type: "success",
      title:
        sign > 0
          ? `${naira(n, false)} added`
          : `${naira(n, false)} moved to your Naira wallet`,
    });
    setAmount("");
    setDialog(null);
  };

  return (
    <Shell current="goal">
      <div className="t-page">
        <header className="t-head">
          <div>
            <Breadcrumbs size="sm">
              <BreadcrumbItem
                href="#"
                onClick={(e) => (e.preventDefault(), go("home"))}
              >
                Savings
              </BreadcrumbItem>
              <BreadcrumbItem>New laptop</BreadcrumbItem>
            </Breadcrumbs>
            <h1 style={{ marginTop: "var(--halo-spacing-4)" }}>New laptop</h1>
            <p className="t-sub">Saving every {plan.day} since July</p>
          </div>
          <div className="t-actions">
            <Button variant="secondary" onClick={() => setDialog("withdraw")}>
              Withdraw
            </Button>
            <Button iconLeft={<Plus />} onClick={() => setDialog("add")}>
              Add money
            </Button>
          </div>
        </header>

        <div className="k-goal-head">
          <section className="t-panel t-neutral" aria-label="Progress">
            <div className="k-saved">
              <ProgressCircle
                value={Math.min(100, pct)}
                showValue
                size="lg"
                aria-label="Saved"
              />
              <div
                className="t-detail"
                style={{ gap: "var(--halo-spacing-2)" }}
              >
                <span className="t-muted">Saved so far</span>
                <strong>{naira(saved, false)}</strong>
                <span className="t-sub" style={{ margin: 0 }}>
                  of {naira(target, false)} ·{" "}
                  {pct >= 100 ? "goal reached" : "on track for 15 Dec 2026"}
                </span>
                <span>
                  <Badge size="sm" color="success" icon={<TrendUp />}>
                    +₦18,240 interest earned
                  </Badge>
                </span>
              </div>
            </div>
          </section>

          <section className="t-panel" aria-labelledby="k-auto">
            <div className="k-row">
              <h2 id="k-auto">Automatic saving</h2>
              <Switch
                aria-label="Automatic saving"
                checked={auto}
                onCheckedChange={setAuto}
              />
            </div>
            <div className="t-two-lines">
              <span>
                {auto
                  ? `${naira(plan.amount, false)} every ${plan.day}`
                  : "Paused"}
              </span>
              <span>
                {auto
                  ? `Next on ${plan.day.slice(0, 3)} 16 Oct from Naira wallet`
                  : "Turn it on to keep saving each week."}
              </span>
            </div>
            <span>
              <LinkButton size="sm" onClick={() => setDialog("plan")}>
                Change amount or day
              </LinkButton>
            </span>
          </section>
        </div>

        <DataTable
          aria-label="History"
          columns={columns}
          rows={history}
          getRowId={(r) => r.id}
          toolbar={
            <TableToolbar
              title="History"
              description={`${history.filter((h) => h.type === "Deposit").length + 10} deposits and ${history.filter((h) => h.type === "Withdrawal").length} withdrawals`}
            />
          }
        />
      </div>

      <Modal
        open={dialog === "add" || dialog === "withdraw"}
        onClose={() => setDialog(null)}
        title={dialog === "add" ? "Add money" : "Withdraw"}
        description={
          dialog === "add"
            ? "From your Naira wallet into New laptop."
            : `You can take out up to ${naira(saved, false)}.`
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button onClick={() => move(dialog === "add" ? 1 : -1)}>
              {dialog === "add" ? "Add money" : "Withdraw"}
            </Button>
          </>
        }
      >
        <InputField
          label="Amount"
          placeholder="₦25,000"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Modal>

      <Modal
        open={dialog === "plan"}
        onClose={() => setDialog(null)}
        title="Automatic saving"
        description="Kova moves this from your Naira wallet each week."
        actions={
          <Button
            onClick={() => {
              setDialog(null);
              toast({
                type: "success",
                title: "Saved",
                description: `${naira(plan.amount, false)} every ${plan.day}.`,
              });
            }}
          >
            Done
          </Button>
        }
      >
        <div className="t-detail">
          <InputField
            label="Amount"
            placeholder="₦25,000"
            inputMode="numeric"
            value={`₦${plan.amount.toLocaleString("en-NG")}`}
            onChange={(e) =>
              setPlan({
                ...plan,
                amount: Number(e.target.value.replace(/\D/g, "")) || 0,
              })
            }
          />
          <SelectField
            label="Day"
            value={plan.day}
            onValueChange={(d) => setPlan({ ...plan, day: d })}
            options={[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => ({ value: d, label: d }))}
          />
        </div>
      </Modal>
    </Shell>
  );
}
