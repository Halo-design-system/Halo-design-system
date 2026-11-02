// Veyra's dashboard: deals closing soon, the quarter's numbers, the pipeline by stage, top performers and satisfaction.
import { useState } from 'react';
import { Alert, Avatar, Badge, Button, Card, LinkButton, ProgressBar, Rating, Select, Statistic, Tab, TabList, Tabs, useToast } from '@halo-ds/react';
import { DownloadSimple, Plus, UsersThree } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { deals, dollars, performers, ratings, stageTotals, stages } from './data';
import { DealCard } from './DealCard';
import { Shell } from './Shell';

export default function Dashboard() {
  const go = useNav();
  const { toast } = useToast();
  const [team, setTeam] = useState('all');
  const [notice, setNotice] = useState(true);

  return (
    <Shell current="dashboard">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>Sales pipeline</h1>
            <p className="t-sub">Fourth quarter 2026, updated 5 minutes ago</p>
          </div>
          <div className="t-actions">
            <div style={{ width: 170 }}>
              <Select
                aria-label="Team"
                icon={<UsersThree />}
                value={team}
                onValueChange={setTeam}
                options={[
                  { value: 'all', label: 'All teams' },
                  { value: 'enterprise', label: 'Enterprise' },
                  { value: 'mid', label: 'Mid-market' },
                  { value: 'small', label: 'Small business' },
                ]}
              />
            </div>
            <Button variant="secondary" iconLeft={<DownloadSimple />} onClick={() => toast({ type: 'success', title: 'Pipeline exported', description: 'Q4 2026, all stages.' })}>
              Export
            </Button>
            <Button iconLeft={<Plus />} onClick={() => go('add-deal')}>
              Add deal
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview">
          <TabList aria-label="Views">
            <Tab value="overview">Overview</Tab>
            <Tab value="deals" onClick={() => go('pipeline')}>
              Deals
            </Tab>
            <Tab value="forecast">Forecast</Tab>
            <Tab value="activity">Activity</Tab>
          </TabList>
        </Tabs>

        {notice && (
          <Alert
            type="information"
            title="3 deals worth $182,000 close this week"
            description="Check the next steps for Lumen Health, Orbit Freight and Kestrel Bank before Friday."
            onClose={() => setNotice(false)}
          />
        )}

        <div className="t-stats">
          <Card>
            <Statistic label="Pipeline value" value="$1.24M" change="+9.0%" trend="up" sentiment="positive" comparison="vs last quarter" />
          </Card>
          <Card>
            <Statistic label="Won this quarter" value="$386K" change="+14.2%" trend="up" sentiment="positive" comparison="vs last quarter" />
          </Card>
          <Card>
            <Statistic label="Win rate" value="32%" change="+3 points" trend="up" sentiment="positive" comparison="vs last quarter" />
          </Card>
          <Card>
            <Statistic label="Average deal size" value="$24.6K" change="-2.1%" trend="down" sentiment="negative" comparison="vs last quarter" />
          </Card>
        </div>

        <section className="t-panel" aria-labelledby="v-stage">
          <div className="t-panel-head">
            <div>
              <h2 id="v-stage">Pipeline by stage</h2>
              <p className="t-muted">24 open deals</p>
            </div>
            <LinkButton size="sm" onClick={() => go('pipeline')}>
              Open board
            </LinkButton>
          </div>
          <div className="v-stages">
            {stages.map((s) => (
              <section key={s} className="t-column" aria-label={s}>
                <div className="v-stage-head">
                  {s}
                  <Badge size="sm" color={s === 'Won' ? 'success' : 'neutral'}>
                    {stageTotals[s].count}
                  </Badge>
                  <span>{stageTotals[s].value}</span>
                </div>
                {deals
                  .filter((d) => d.stage === s)
                  .map((d) => (
                    <DealCard key={d.id} deal={d} onOpen={() => go('deal')} />
                  ))}
              </section>
            ))}
          </div>
        </section>

        <div className="t-split">
          <section className="t-panel" aria-labelledby="v-top">
            <div className="t-panel-head">
              <div>
                <h2 id="v-top">Top performers</h2>
                <p className="t-muted">Deals won this quarter</p>
              </div>
              <LinkButton size="sm">See team</LinkButton>
            </div>
            {performers.map((p, i) => (
              <div key={p.who.name} className="v-rank">
                <span className="t-muted">{i + 1}</span>
                <span className="t-person">
                  <Avatar src={p.who.src} name={p.who.name} size="md" />
                  <span className="t-two-lines">
                    <strong>{p.who.name}</strong>
                    <span>{p.who.role}</span>
                  </span>
                </span>
                <span className="t-neutral">
                  <ProgressBar value={p.value} max={150000} size="sm" aria-label={`${p.who.name}, ${p.deals} deals`} />
                  <span className="t-muted">{p.deals} deals</span>
                </span>
                <strong>{dollars(p.value)}</strong>
              </div>
            ))}
          </section>

          <section className="t-panel" aria-labelledby="v-csat">
            <div>
              <h2 id="v-csat">Customer satisfaction</h2>
              <p className="t-muted">From closed deals this quarter</p>
            </div>
            <div className="v-score">
              <strong>4.5</strong>
              <span className="t-two-lines">
                <Rating value={4.5} allowHalf readOnly aria-label="4.5 out of 5" />
                <span>312 reviews</span>
              </span>
            </div>
            <div className="v-ratings t-neutral">
              {ratings.map((r) => (
                <ProgressBar key={r.stars} label={`${r.stars} star${r.stars > 1 ? 's' : ''}`} valueLabel={`${r.share}%`} value={r.share} size="sm" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
