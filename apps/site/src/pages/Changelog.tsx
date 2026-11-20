import { Fragment, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Avatar, Badge, SegmentedControl } from '@halo-ds/react';
import type { BadgeColor } from '@halo-ds/react';
import { links } from '../router';
import entries from '../changelog.json';

// Made from CHANGELOG.md by scripts/changelog.mjs, with the date and person from git
type Entry = { version: string; type: Type; title: string; text: string; date: string; author: string };
type Type = 'New' | 'Update' | 'Bug fix' | 'Deprecated';

const colour: Record<Type, BadgeColor> = { New: 'success', Update: 'information', 'Bug fix': 'warning', Deprecated: 'error' };
const filters = ['All', 'New', 'Update', 'Bug fix', 'Deprecated'] as const;
// Where each person's name links to
const profiles: Record<string, string> = { 'Chidindu Faith': links.x };
const repo = 'https://github.com/Halo-design-system/Halo-design-system/blob/main/';

const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatDate = (iso: string) => day.format(new Date(`${iso}T00:00:00Z`));

/** The changelog's own Markdown: **bold**, `code` and [links](...). */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = m.index;
    if (m[1]) out.push(<strong key={k}>{inline(m[1])}</strong>);
    else if (m[2]) out.push(<code key={k}>{m[2]}</code>);
    else out.push(<a key={k} href={/^https?:/.test(m[4]!) ? m[4] : repo + m[4]}>{m[3]}</a>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Changelog() {
  const [type, setType] = useState<(typeof filters)[number]>('All');
  const shown = useMemo(() => (entries as Entry[]).filter((e) => type === 'All' || e.type === type), [type]);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Docs</p>
        <h1>Changelog</h1>
        <p className="lede">Every change to the components, tokens and CLI.</p>
      </header>

      <div className="changelog-tools">
        <SegmentedControl
          aria-label="Type of change"
          size="sm"
          value={type}
          onValueChange={(v) => setType(v as (typeof filters)[number])}
          options={filters.map((f) => ({ value: f, label: f }))}
        />
      </div>

      {shown.length ? (
        <div className="docs-table-wrap">
          <table className="docs-table changelog">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Change</th>
                <th scope="col">By</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((e, i) => (
                <Fragment key={i}>
                  {/* A row naming the version above its first change */}
                  {e.version !== shown[i - 1]?.version && (
                    <tr className="changelog-version">
                      <th scope="colgroup" colSpan={4}>{e.version}</th>
                    </tr>
                  )}
                  <tr>
                    <td className="changelog-date">{formatDate(e.date)}</td>
                    <td><Badge size="sm" color={colour[e.type]}>{e.type}</Badge></td>
                    <td className="changelog-change">
                      {e.title && <strong>{inline(e.title)}</strong>}
                      <span>{inline(e.text)}</span>
                    </td>
                    <td>
                      {profiles[e.author] ? (
                        <a className="changelog-by" href={profiles[e.author]} target="_blank" rel="noreferrer">
                          <Avatar size="xs" name={e.author} />
                          {e.author}
                        </a>
                      ) : (
                        <span className="changelog-by">
                          <Avatar size="xs" name={e.author} />
                          {e.author}
                        </span>
                      )}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="changelog-empty">No changes match.</p>
      )}
    </>
  );
}
