// `halo-ds skills`: puts Halo's skills into a project, for AI tools that read them from files.
// Skills go to .claude/skills (Claude Code); the short rules go into AGENTS.md, which Cursor,
// Copilot, Codex and others read. Running it again updates both instead of adding copies.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { skills } from './mcp';

const START = '<!-- halo:start -->';
const END = '<!-- halo:end -->';

/** Writes every skill into <dir>/.claude/skills/halo-<name>/, renamed so it can't clash with the project's own skills. */
export function writeSkills(dir: string) {
  const written: string[] = [];
  for (const [path, text] of Object.entries(skills)) {
    const m = path.match(/^skills\/([^/]+)\/(.+)$/);
    if (!m) continue;
    const [, skill, rest] = m;
    const file = join(dir, '.claude', 'skills', `halo-${skill}`, rest!);
    mkdirSync(dirname(file), { recursive: true });
    // The skill's name becomes halo-<name>, to match its folder
    writeFileSync(file, rest === 'SKILL.md' ? text.replace(/^name:\s*.+$/m, `name: halo-${skill}`) : text);
    if (rest === 'SKILL.md') written.push(`halo-${skill}`);
  }
  return written;
}

/** Adds the short rules to AGENTS.md between markers, replacing an earlier copy. */
export function writeAgents(dir: string): 'created' | 'added' | 'updated' {
  const file = join(dir, 'AGENTS.md');
  const block = `${START}\n${skills['INSTRUCTIONS.md']!.trim()}\n${END}`;
  if (!existsSync(file)) {
    writeFileSync(file, `${block}\n`);
    return 'created';
  }
  const src = readFileSync(file, 'utf8');
  const a = src.indexOf(START);
  const b = src.indexOf(END);
  if (a >= 0 && b > a) {
    writeFileSync(file, src.slice(0, a) + block + src.slice(b + END.length));
    return 'updated';
  }
  writeFileSync(file, `${src.trimEnd()}\n\n${block}\n`);
  return 'added';
}
