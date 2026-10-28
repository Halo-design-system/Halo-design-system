// Colour maths for `halo-ds theme`: turn one brand colour into the brand variables for light and dark.

export type Rgb = [number, number, number];

/** Reads #RGB or #RRGGBB, with or without the #. Returns null when it isn't a hex colour. */
export function parseHex(input: string): Rgb | null {
  const hex = input.trim().replace(/^#/, '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

export const toHex = (rgb: Rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** Mixes `rgb` into `base`: amount 0 is all base, 1 is all rgb. */
export const mix = (rgb: Rgb, base: Rgb, amount: number): Rgb => rgb.map((v, i) => base[i]! + (v - base[i]!) * amount) as Rgb;

function toHsl([r, g, b]: Rgb): [number, number, number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0) : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
  return [h / 6, s, l];
}

function fromHsl([h, s, l]: [number, number, number]): Rgb {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const ch = (t: number) => {
    const tt = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return [ch(h + 1 / 3) * 255, ch(h) * 255, ch(h - 1 / 3) * 255];
}

/** Moves the lightness by `delta` (-1 to 1), keeping the hue. */
export function shade(rgb: Rgb, delta: number): Rgb {
  const [h, s, l] = toHsl(rgb);
  return fromHsl([h, s, Math.min(1, Math.max(0, l + delta))]);
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

export function contrast(a: Rgb, b: Rgb) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Steps the lightness until the colour reaches `target` contrast on `background`. */
function readableOn(rgb: Rgb, background: Rgb, target: number): Rgb {
  const step = luminance(background) > 0.5 ? -0.02 : 0.02;
  let out = rgb;
  for (let i = 0; i < 50 && contrast(out, background) < target; i++) out = shade(out, step);
  return out;
}

const WHITE: Rgb = [255, 255, 255];
const PAGE_DARK: Rgb = [28, 28, 28];

/** The brand variables for one colour, in light and dark mode. Same names as the Theming guide. */
export function brandVariables(brand: Rgb) {
  const hover = shade(brand, -0.08);
  const light: Record<string, string> = {
    '--halo-button-primary': toHex(brand),
    '--halo-button-primary-hover': toHex(hover),
    '--halo-button-primary-pressed': toHex(hover),
    '--halo-fill-brand': toHex(brand),
    '--halo-fill-brand-hover': toHex(hover),
    '--halo-surface-brand': toHex(mix(brand, WHITE, 0.08)),
    '--halo-surface-brand-secondary': toHex(mix(brand, WHITE, 0.25)),
    '--halo-surface-brand-contrast': toHex(hover),
    '--halo-surface-brand-heavy-contrast': toHex(shade(brand, -0.25)),
    '--halo-text-brand': toHex(readableOn(brand, WHITE, 4.5)),
    '--halo-text-link': toHex(brand),
    '--halo-border-contrast': toHex(brand),
    '--halo-border-focus': toHex(mix(brand, WHITE, 0.25)),
    '--halo-illustration-accent': toHex(mix(brand, WHITE, 0.18)),
    '--halo-illustration-accent-strong': toHex(mix(brand, WHITE, 0.65)),
  };
  const tintDark = mix(brand, PAGE_DARK, 0.35);
  const textDark = readableOn(mix(brand, WHITE, 0.6), PAGE_DARK, 4.5);
  const dark: Record<string, string> = {
    '--halo-surface-brand': toHex(mix(brand, PAGE_DARK, 0.22)),
    '--halo-surface-brand-secondary': toHex(tintDark),
    '--halo-surface-brand-heavy-contrast': toHex(textDark),
    '--halo-text-brand': toHex(textDark),
    '--halo-text-link': toHex(textDark),
    '--halo-border-focus': toHex(tintDark),
    '--halo-illustration-accent': toHex(tintDark),
    '--halo-illustration-accent-strong': toHex(textDark),
  };
  return { light, dark, buttonTextContrast: contrast(WHITE, brand) };
}

/** The CSS file `halo-ds theme` writes. Plain CSS, so it wins over Halo's layered defaults. */
export function themeCss(brandHex: string) {
  const brand = parseHex(brandHex)!;
  const { light, dark } = brandVariables(brand);
  const block = (vars: Record<string, string>, indent: string) =>
    Object.entries(vars)
      .map(([k, v]) => `${indent}${k}: ${v};`)
      .join('\n');
  return `/* Your brand colour for Halo, made by \`npx halo-ds theme ${toHex(brand)}\`. Edit freely. */

:root,
[data-theme='light'] {
${block(light, '  ')}
}

[data-theme='dark'] {
${block(dark, '  ')}
}

@media (prefers-color-scheme: dark) {
  [data-theme='system'] {
${block(dark, '    ')}
  }
}
`;
}
