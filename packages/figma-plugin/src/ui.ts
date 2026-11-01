// The plugin window: every Halo component, grouped like the website, with search.
// Clicking a row places its main part; the chips under it place the other parts.
import { groups } from '../../../apps/site/src/catalog';
import type { Entry } from '../../../apps/site/src/catalog';
import { parts } from './library';

const list = document.getElementById('list')!;
const search = document.getElementById('search') as HTMLInputElement;
const status = document.getElementById('status')!;
const banner = document.getElementById('banner')!;

const send = (msg: object) => parent.postMessage({ pluginMessage: msg }, '*');

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);

function matches(entry: Entry, query: string) {
  if (!query) return true;
  const haystack = [entry.name, entry.description, ...entry.exports, ...(parts[entry.slug] ?? []).map((p) => p.name)]
    .join(' ')
    .toLowerCase();
  return query.split(/\s+/).every((word) => haystack.includes(word));
}

function render() {
  const query = search.value.trim().toLowerCase();
  let html = '';
  for (const group of groups) {
    const items = group.items.filter((entry) => matches(entry, query));
    if (!items.length) continue;
    html += `<section><h2>${escape(group.name)}</h2>`;
    for (const entry of items) {
      const own = parts[entry.slug] ?? [];
      html += `<div class="item">
        <button class="row" data-slug="${entry.slug}" data-index="0">
          <span class="name">${escape(entry.name)}</span>
          <span class="description">${escape(entry.description)}</span>
        </button>`;
      if (own.length > 1) {
        html += '<div class="chips">';
        own.forEach((part, index) => {
          html += `<button class="chip" data-slug="${entry.slug}" data-index="${index}">${escape(part.name)}</button>`;
        });
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</section>';
  }
  list.innerHTML = html || `<p class="empty">No components match “${escape(search.value.trim())}”.</p>`;
}

function say(text: string, tone: 'info' | 'error' = 'info') {
  status.textContent = text;
  status.dataset.tone = tone;
}

list.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-slug]');
  if (!button) return;
  say('Placing…');
  send({ type: 'place', slug: button.dataset.slug, index: Number(button.dataset.index) });
});

search.addEventListener('input', render);
search.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  list.querySelector<HTMLButtonElement>('button.row')?.click();
});

banner.addEventListener('click', (event) => {
  const action = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]')?.dataset.action;
  if (action === 'remember') {
    say('Reading the components in this file…');
    send({ type: 'remember' });
  } else if (action === 'forget') {
    send({ type: 'forget' });
    say('Back to the published Halo library.');
  }
});

interface State {
  haloFile: boolean;
  fileName: string;
  copy: string | null;
}

function showState({ haloFile, fileName, copy }: State) {
  if (haloFile && copy !== fileName) {
    banner.innerHTML = `<p>This file has the Halo components. Use it as your library, so other files place components from it once you publish it.</p>
      <button class="secondary" data-action="remember">Use this file</button>`;
  } else if (copy) {
    banner.innerHTML = `<p>Placing from your copy, <strong>${escape(copy)}</strong>.</p>
      <button class="secondary" data-action="forget">Stop using it</button>`;
  } else {
    banner.innerHTML = '';
  }
  banner.hidden = !banner.innerHTML;
}

onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage;
  if (!msg) return;
  if (msg.type === 'state') showState(msg);
  else if (msg.type === 'placed') say(`Placed ${msg.name}.`);
  else if (msg.type === 'remembered')
    say(
      `Saved ${msg.count} components from ${msg.name}.` +
        (msg.missing ? ` ${msg.missing} weren’t found in it.` : '') +
        ' Publish this file as a library, then add it to the files you design in.',
    );
  else if (msg.type === 'missing')
    say(
      `Couldn’t find ${msg.name}. Add the Halo library to this file (Assets, then Libraries), or open the plugin in your copy of Halo and choose Use this file.`,
      'error',
    );
};

render();
search.focus();
