// Turns CHANGELOG.md into src/changelog.json for the Changelog page.
// Each entry is a line like `- [Update] **Title:** what changed.` under a version heading. The date and the person come
// from git: the first commit that added the entry's words to CHANGELOG.md. Entries not committed yet get today's date and
// the git user's name. Runs before every dev server and build, so the page always matches the file.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../../../', import.meta.url);
const file = new URL('CHANGELOG.md', root);
const out = new URL('../src/changelog.json', import.meta.url);
const TYPES = ['New', 'Update', 'Bug fix', 'Deprecated'];

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};
const me = git(['config', 'user.name']) || 'Halo';
const today = new Date().toISOString().slice(0, 10);

// One blame of the committed file: each line's text (without its type label) → the commit that last wrote it
const blamed = new Map();
{
  const commits = {};
  let sha = '';
  for (const l of git(['blame', '--line-porcelain', 'HEAD', '--', 'CHANGELOG.md']).split('\n')) {
    const head = l.match(/^([0-9a-f]{40}) /);
    if (head) { sha = head[1]; commits[sha] ??= {}; continue; }
    if (l.startsWith('author ')) commits[sha].author = l.slice(7);
    else if (l.startsWith('author-time ')) commits[sha].date = new Date(Number(l.slice(12)) * 1000).toISOString().slice(0, 10);
    else if (l.startsWith('\t')) {
      const text = l.slice(1).replace(/^- (\[[^\]]+\] )?/, '');
      if (!blamed.has(text)) blamed.set(text, commits[sha]);
    }
  }
}

/** Who wrote this entry, and when. Lines not committed yet are today's, by the git user. */
const origin = (text) => blamed.get(text) ?? { date: today, author: me };

const entries = [];
let version = 'Unreleased';
let current = null;
for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
  const heading = line.match(/^## (.+)/);
  if (heading) {
    version = heading[1].trim();
    current = null;
    continue;
  }
  const item = line.match(/^- \[([^\]]+)\] (.*)$/);
  if (item) {
    const type = TYPES.includes(item[1]) ? item[1] : 'Update';
    let body = item[2];
    // A bold start is the title; the rest is what changed
    let title = '';
    const bold = body.match(/^\*\*(.+?)\*\*[:.]?\s*(.*)$/);
    if (bold) {
      title = bold[1].replace(/[:.]$/, '');
      body = bold[2].replace(/^[:.,]\s*/, '');
      body = body.charAt(0).toUpperCase() + body.slice(1);
    }
    current = { version, type, title, text: body, ...origin(item[2]) };
    entries.push(current);
    continue;
  }
  // Indented points belong to the entry above
  const sub = line.match(/^\s+- (.*)$/);
  if (sub && current) current.text += (current.text ? ' ' : '') + sub[1];
}

writeFileSync(out, JSON.stringify(entries, null, 1) + '\n');
console.log(`Changelog: ${entries.length} entries`);
