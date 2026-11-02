// Writes every Phosphor icon, regular and fill, to public/foundation/icons.json for the Icons page.
// One file the page fetches when it opens, so the icons stay out of the site's main download.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Phosphor from '@phosphor-icons/react';

const skip = new Set(['IconContext', 'IconBase', 'SSR']);
const names = Object.keys(Phosphor).filter((n) => /^[A-Z]/.test(n) && !n.endsWith('Icon') && !skip.has(n) && typeof Phosphor[n] === 'object');
// Keep only what goes inside the <svg>; every icon shares the same 256 by 256 box
const inner = (name, weight) => renderToStaticMarkup(createElement(Phosphor[name], { weight })).replace(/^<svg[^>]*>|<\/svg>$/g, '');
const icons = Object.fromEntries(names.map((n) => [n, [inner(n, 'regular'), inner(n, 'fill')]]));

mkdirSync(new URL('../public/foundation/', import.meta.url), { recursive: true });
writeFileSync(new URL('../public/foundation/icons.json', import.meta.url), JSON.stringify(icons));
console.log(`Wrote ${names.length} icons to public/foundation/icons.json`);
