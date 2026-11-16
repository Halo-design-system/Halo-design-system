// Writes a real HTML page for every address on the website, so search engines, link previews and AI
// assistants that don't run JavaScript still get each page's title, description and content.
// The app replaces the content as soon as it starts. Also writes the sitemap and robots.txt.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { all, groups } from '../../../apps/site/src/catalog';
import { guides } from '../../../apps/site/src/guide';
import { HOME_DESCRIPTION, NAME, SITE, docsPages, exampleApps, faqs, pages } from '../../../apps/site/src/seo';
import type { PageMeta } from '../../../apps/site/src/seo';
import { blocks, getBlock, getComponent } from './mcp';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown: code, links and bold. */
function inline(text: string) {
  return esc(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Enough Markdown for the docs pages: headings, paragraphs, lists, tables and code blocks. */
export function markdownToHtml(md: string) {
  const out: string[] = [];
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.startsWith('```')) code.push(lines[i++]!);
      i++;
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      // The page title is the h1, so headings in the Markdown start at h2
      const level = Math.min(6, h[1]!.length + 1);
      out.push(`<h${level}>${inline(h[2]!)}</h${level}>`);
      i++;
      continue;
    }
    if (/^\s*[-*+] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+] /.test(lines[i]!)) items.push(`<li>${inline(lines[i++]!.replace(/^\s*[-*+] /, ''))}</li>`);
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.startsWith('|')) {
        const cells = lines[i++]!.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
      }
      const [head, ...body] = rows;
      out.push(`<table><thead><tr>${(head ?? []).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i]!.trim() && !/^(#|```|\||\s*[-*+] )/.test(lines[i]!)) para.push(lines[i++]!);
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

const link = (path: string, text: string) => `<a href="${path}">${esc(text)}</a>`;
const list = (items: [string, string, string?][]) => `<ul>${items.map(([p, t, d]) => `<li>${link(p, t)}${d ? `: ${esc(d)}` : ''}</li>`).join('')}</ul>`;

/** The words on each page, as plain HTML. */
function bodyFor(page: PageMeta): string {
  const p = page.path;
  if (p === '/') {
    return [
      `<p>${esc(HOME_DESCRIPTION)}</p>`,
      '<h2>What comes with Halo</h2>',
      list([
        ['/components', 'React components', `${all.length} accessible components in light and dark mode, with live examples and props`],
        ['/figma', 'Figma library', 'Every component, variant and token from the code'],
        ['/components/blocks', 'Blocks', 'Whole page sections like sign-in, pricing and dashboards'],
        ['/examples', 'Example apps', 'Seven apps and 29 screens built only from Halo'],
        ['/docs/cli', 'CLI', 'npx halo-ds init sets a project up; theme, add and docs do the rest'],
        ['/docs/ai', 'MCP server and AI skills', 'Your AI assistant reads real props, examples and rules'],
      ]),
      '<h2>Get started</h2>',
      '<pre><code>npx halo-ds init</code></pre>',
      '<h2>Frequently asked questions</h2>',
      faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n'),
    ].join('\n');
  }
  if (p === '/components') {
    return groups.map((g) => `<h2>${esc(g.name)}</h2>${list(g.items.map((e) => [`/components/${e.slug}`, e.name, e.description]))}`).join('\n');
  }
  const component = p.match(/^\/components\/([^/]+)$/)?.[1];
  if (component && component !== 'blocks') return markdownToHtml(getComponent(component, true).replace(/^# .*\n/, ''));
  if (p === '/components/blocks') return list(blocks.map((b) => [`/components/blocks/${b.slug}`, b.title, b.description]));
  const block = p.match(/^\/components\/blocks\/(.+)$/)?.[1];
  if (block) return markdownToHtml(getBlock(block).replace(/^# .*\n/, ''));
  const figma = p.match(/^\/figma\/(.+)$/)?.[1];
  if (figma) {
    const g = guides[figma];
    if (!g) return `<p>${esc(page.description)}</p>`;
    return [
      `<p>${esc(g.callout)}</p>`,
      ...g.about.map((a) => `<p>${esc(a)}</p>`),
      '<h2>Do</h2>',
      `<ul>${g.dos.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`,
      "<h2>Don't</h2>",
      `<ul>${g.donts.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`,
      `<p>${link(`/components/${figma}`, 'Code and examples')}</p>`,
    ].join('\n');
  }
  if (p === '/figma') return `<p>${esc(page.description)}</p>${list(all.filter((e) => guides[e.slug]).map((e) => [`/figma/${e.slug}`, e.name]))}`;
  if (p === '/docs') return `<p>${esc(page.description)}</p>${list(docsPages.filter((d) => d.slug).map((d) => [`/docs/${d.slug}`, d.title, d.description]))}`;
  if (p === '/examples') return `<p>${esc(page.description)}</p>${list(exampleApps.map((a) => [`/examples/${a.id}`, a.name, a.about]))}`;
  return `<p>${esc(page.description)}</p>`;
}

/** Structured data, so search results can show the trail, the questions and what Halo is. */
function jsonLd(page: PageMeta) {
  const url = SITE + (page.path === '/' ? '/' : page.path);
  const items: object[] = [];
  if (page.path === '/') {
    items.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: NAME, url: `${SITE}/`, description: HOME_DESCRIPTION });
    items.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: NAME,
      description: HOME_DESCRIPTION,
      url: `${SITE}/`,
      codeRepository: 'https://github.com/Halo-design-system/Halo-design-system',
      programmingLanguage: ['TypeScript', 'React'],
      license: 'https://opensource.org/licenses/MIT',
    });
    items.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  } else {
    items.push({ '@context': 'https://schema.org', '@type': 'TechArticle', headline: page.title.replace(/ · .*$/, ''), description: page.description, url, isPartOf: { '@type': 'WebSite', name: NAME, url: `${SITE}/` } });
  }
  if (page.crumbs.length) {
    const trail = [...page.crumbs, { name: page.title.replace(/ · .*$/, '').replace(/: React component$/, ''), path: page.path }];
    items.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((c, n) => ({ '@type': 'ListItem', position: n + 1, name: c.name, item: SITE + c.path })) });
  }
  return items.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('\n    ');
}

function headFor(page: PageMeta) {
  const url = SITE + (page.path === '/' ? '/' : page.path);
  const markdown = /^\/components\/(?!blocks$|foundation\/)/.test(page.path) ? `\n    <link rel="alternate" type="text/markdown" href="${page.path}.md" title="This page as Markdown" />` : '';
  return `<title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${page.path === '/' ? 'website' : 'article'}" />
    <meta property="og:site_name" content="${NAME}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Halo Design System: React components and a Figma library" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${SITE}/og.png" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="Halo docs for AI assistants" />${markdown}
    ${jsonLd(page)}`;
}

const NAV = `<nav aria-label="Site"><a href="/">Home</a> · <a href="/components">Components</a> · <a href="/examples">Examples</a> · <a href="/figma">Figma</a> · <a href="/docs">Docs</a> · <a href="/storybook/">Storybook</a></nav>`;

/** Hidden once JavaScript runs, so people never see it flash before the app draws the page. */
const HIDE = `<script>document.documentElement.classList.add('js')</script>
    <style>.js .static-page{display:none}</style>`;

export function writePages(out: string) {
  const template = readFileSync(join(out, 'index.html'), 'utf8');
  const list = pages(blocks);
  for (const page of list) {
    const head = template
      .replace(/<title>[\s\S]*?<\/title>\s*/, '')
      .replace(/<meta name="description"[^>]*>\s*/, '')
      .replace('</head>', `    ${headFor(page)}\n    ${HIDE}\n  </head>`);
    const content = `<div class="static-page">${NAV}<main><h1>${esc(page.title.replace(/ · .*$/, ''))}</h1>\n${bodyFor(page)}</main></div>`;
    const html = head.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
    // /components/button is served from components/button.html, so the address needs no trailing slash
    const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`;
    mkdirSync(dirname(join(out, file)), { recursive: true });
    writeFileSync(join(out, file), html);
  }

  // Addresses that aren't pages keep the app, but search engines should leave them out
  const notFound = join(out, '404.html');
  writeFileSync(notFound, readFileSync(notFound, 'utf8').replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>'));

  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list
      .map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  // Search engines and AI assistants are welcome. The frames are pieces of other pages, not pages of their own.
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /app-frame/\nDisallow: /block-frame/\n\nSitemap: ${SITE}/sitemap.xml\n`);
  return list.length;
}
