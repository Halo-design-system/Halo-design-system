// A project's board: tasks in four columns. Click a task to open it in a drawer, tick its checklist and mark it done.
import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Checkbox,
  CompactButton,
  Drawer,
  EmptyState,
  Illustration,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  useToast,
} from '@halo-ds/react';
import { PaperPlaneRight, Plus, ShareNetwork } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { people, tasks as start } from './data';
import type { Column, Task } from './data';
import { Shell } from './Shell';

const columns: Column[] = ['To do', 'In progress', 'In review', 'Done'];

function TaskDetail({ task, onChange, onClose }: { task: Task | null; onChange: (t: Task) => void; onClose: () => void }) {
  const [comment, setComment] = useState('');
  if (!task) return <Drawer open={false} onClose={onClose} title="" />;
  const list = task.checklist ?? [];
  const done = list.filter((c) => c.done).length;
  return (
    <Drawer
      open
      onClose={onClose}
      title={task.title}
      description={`Brand refresh · ${task.column}`}
      size="md"
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={task.column === 'Done'}
            onClick={() => {
              onChange({ ...task, column: 'Done', due: 'Done today' });
              onClose();
            }}
          >
            Mark as done
          </Button>
        </>
      }
    >
      <div className="t-detail">
        <dl className="t-fields">
          <dt>Status</dt>
          <dd>
            <Select aria-label="Status" value={task.column} onValueChange={(v) => onChange({ ...task, column: v as Column })} options={columns.map((c) => ({ value: c, label: c }))} />
          </dd>
          <dt>Assignee</dt>
          <dd className="t-person">
            <Avatar src={task.who.src} name={task.who.name} size="xs" />
            {task.who.name}
          </dd>
          <dt>Due</dt>
          <dd>{task.due.replace('Due ', '')} 2026</dd>
          <dt>Label</dt>
          <dd>
            <Tag size="sm">{task.label}</Tag>
          </dd>
        </dl>

        {task.about && <p style={{ margin: 0 }}>{task.about}</p>}

        {list.length > 0 && (
          <div className="t-list">
            <h3>
              Checklist · {done} of {list.length}
            </h3>
            {list.map((c, i) => (
              <Checkbox
                key={c.text}
                label={c.text}
                checked={c.done}
                onCheckedChange={(on) => onChange({ ...task, checklist: list.map((x, j) => (j === i ? { ...x, done: on } : x)) })}
              />
            ))}
          </div>
        )}

        <div className="t-list">
          <h3>Comments</h3>
          {(task.comments ?? []).map((c) => (
            <div key={c.text} className="t-comment">
              <Avatar src={c.who.src} name={c.who.name} size="sm" />
              <span className="t-two-lines">
                <span>
                  <strong>{c.who.name}</strong> <span className="t-muted">{c.when}</span>
                </span>
                <span style={{ color: 'var(--halo-text-primary)' }}>{c.text}</span>
              </span>
            </div>
          ))}
          <form
            className="t-person"
            onSubmit={(e) => {
              e.preventDefault();
              if (!comment.trim()) return;
              onChange({ ...task, comments: [...(task.comments ?? []), { who: people.ada, when: 'Just now', text: comment.trim() }] });
              setComment('');
            }}
          >
            <Input aria-label="Write a comment" placeholder="Write a comment" value={comment} onChange={(e) => setComment(e.target.value)} style={{ flex: 1 }} />
            <CompactButton type="submit" variant="stroke" aria-label="Send comment">
              <PaperPlaneRight />
            </CompactButton>
          </form>
        </div>
      </div>
    </Drawer>
  );
}

/** The board. `openTask` opens a task's drawer straight away. */
export function Board({ openTask }: { openTask?: string }) {
  const go = useNav();
  const { toast } = useToast();
  const [tasks, setTasks] = useState(start);
  const [open, setOpen] = useState<string | null>(openTask ?? null);
  const current = tasks.find((t) => t.id === open) ?? null;

  const change = (t: Task) => {
    const before = tasks.find((x) => x.id === t.id);
    setTasks(tasks.map((x) => (x.id === t.id ? t : x)));
    if (before && before.column !== t.column) toast({ type: 'success', title: `Moved to ${t.column}`, description: t.title });
  };

  return (
    <Shell current="project">
      <div className="t-page">
        <header className="t-head">
          <div>
            <Breadcrumbs size="sm">
              <BreadcrumbItem href="#" onClick={(e) => (e.preventDefault(), go('overview'))}>
                Projects
              </BreadcrumbItem>
              <BreadcrumbItem>Brand refresh</BreadcrumbItem>
            </Breadcrumbs>
            <h1 style={{ marginTop: 'var(--halo-spacing-4)' }}>Brand refresh</h1>
            <p className="t-sub">New logo and design system · Due 12 Nov 2026</p>
          </div>
          <div className="t-actions">
            <AvatarGroup size="sm" max={4} total={7}>
              {Object.values(people)
                .slice(0, 4)
                .map((p) => (
                  <Avatar key={p.name} src={p.src} name={p.name} />
                ))}
            </AvatarGroup>
            <Button variant="secondary" iconLeft={<ShareNetwork />} onClick={() => toast({ type: 'success', title: 'Link copied', description: 'Anyone in Tessel can open it.' })}>
              Share
            </Button>
            <Button iconLeft={<Plus />} onClick={() => setTasks([...tasks, { id: `t${tasks.length + 1}`, title: 'New task', label: 'Design', who: people.ada, due: 'Due 30 Oct', column: 'To do' }])}>
              New task
            </Button>
          </div>
        </header>

        <Tabs defaultValue="board">
          <TabList aria-label="Views">
            <Tab value="board">Board</Tab>
            <Tab value="list">List</Tab>
            <Tab value="timeline">Timeline</Tab>
            <Tab value="files">Files</Tab>
          </TabList>
          <TabPanel value="board">
            <div className="t-board" style={{ marginTop: 'var(--halo-spacing-9)' }}>
              {columns.map((col) => {
                const items = tasks.filter((t) => t.column === col);
                return (
                  <section key={col} className="t-column" aria-label={col}>
                    <div className="t-column-head">
                      <span>
                        {col} <span className="t-count">{items.length}</span>
                      </span>
                      <CompactButton variant="ghost" aria-label={`Add to ${col}`} onClick={() => setTasks([...tasks, { id: `t${tasks.length + 1}`, title: 'New task', label: 'Design', who: people.ada, due: 'Due 30 Oct', column: col }])}>
                        <Plus />
                      </CompactButton>
                    </div>
                    {items.map((t) => (
                      <button key={t.id} type="button" className="t-task" onClick={() => setOpen(t.id)}>
                        <span className="t-task-title">{t.title}</span>
                        <span>
                          <Tag size="sm">{t.label}</Tag>
                        </span>
                        <span className="t-task-foot">
                          <Avatar src={t.who.src} name={t.who.name} size="xs" />
                          <span className="t-muted">{t.due}</span>
                        </span>
                      </button>
                    ))}
                  </section>
                );
              })}
            </div>
          </TabPanel>
          {['list', 'timeline', 'files'].map((v) => (
            <TabPanel key={v} value={v}>
              <EmptyState media={<Illustration name="no-projects" size={140} />} title="Nothing here yet" description="This example shows the board. The other views work the same way." />
            </TabPanel>
          ))}
        </Tabs>
      </div>
      <TaskDetail task={current} onChange={change} onClose={() => setOpen(null)} />
    </Shell>
  );
}

export default function ProjectBoard() {
  return <Board />;
}
