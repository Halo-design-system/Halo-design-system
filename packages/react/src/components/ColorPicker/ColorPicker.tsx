import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, KeyboardEvent, PointerEvent } from 'react';
import { cx } from '../../internal/cx';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { mergeRefs, Portal, useDismiss, useFloating } from '../../internal/floating';
import { Icon } from '../../internal/Icon';
import { StatusIcon } from '../../internal/StatusIcon';
import { useControllable } from '../../internal/useControllable';
import { CompactButton } from '../CompactButton';
import { Field } from '../Field';
import type { FieldProps, FieldWrapperProps } from '../Field';
import { Input } from '../Input';
import inputStyles from '../Input/Input.module.css';
import { Select } from '../Select';
import { clamp, hslToRgb, hsvToRgb, parseHex, rgbToHsl, rgbToHsv, toHex } from './color';
import type { Hsva } from './color';
import { useIsClient } from '../../internal/useIsClient';
import styles from './ColorPicker.module.css';

/* ---------- Swatch ---------- */

export interface ColorSwatchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Any CSS colour. */
  color: string;
  /** Figma: Shape. */
  shape?: 'square' | 'circle';
  /** 20 or 24px. Figma: Size. */
  size?: 'sm' | 'md';
  /** Figma: State=Selected. */
  selected?: boolean;
}

/** A clickable sample of a colour. Name it with aria-label, like "Purple". */
export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(function ColorSwatch(
  { color, shape = 'square', size = 'md', selected, className, style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      data-halo="color-swatch"
      data-part="root"
      className={cx(styles.swatch, styles[shape], styles[size], selected && styles.selected, className)}
      style={{ ...style, '--swatch': color } as CSSProperties}
      {...rest}
    />
  );
});

/* ---------- Picker ---------- */

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/** Parts of the picker panel you can style with `classNames` and `styles`. */
export type ColorPickerPart = 'root' | 'area' | 'thumb' | 'sliders' | 'track' | 'values' | 'format' | 'fields' | 'swatches';

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, PartsProps<ColorPickerPart> {
  /** A hex colour like "#CC1DD0", or "#CC1DD080" with opacity. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Figma: Show opacity. */
  showOpacity?: boolean;
  /** Shows the eyedropper where the browser supports it. Figma: Show eyedropper. */
  showEyedropper?: boolean;
  /** Preset colours under the picker. Figma: Show swatches. */
  swatches?: string[];
  /** Which values the fields show first. Figma: Format. */
  defaultFormat?: ColorFormat;
}

const toHsva = (hex: string): Hsva => rgbToHsv(parseHex(hex) ?? { r: 0, g: 0, b: 0, a: 1 });

/** Picks a colour by dragging, typing a value or choosing a swatch. Every part works with the keyboard. */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  { value, defaultValue = '#CC1DD0', onValueChange, showOpacity = true, showEyedropper = true, swatches, defaultFormat = 'hex', className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const [hex, setHex] = useControllable(value, defaultValue, onValueChange);
  // Keep HSV locally so the hue survives when the colour goes grey or black.
  const part = parts<ColorPickerPart>('color-picker', { classNames, styles: partStyles });
  const [hsva, setHsva] = useState<Hsva>(() => toHsva(hex));
  const [format, setFormat] = useState<ColorFormat>(defaultFormat);
  const area = useRef<HTMLDivElement | null>(null);
  const lastSent = useRef(hex);

  useEffect(() => {
    if (hex.toUpperCase() !== lastSent.current.toUpperCase()) setHsva(toHsva(hex));
  }, [hex]);

  const commit = (next: Hsva) => {
    setHsva(next);
    const h = toHex(hsvToRgb(next), showOpacity && next.a < 1);
    lastSent.current = h;
    setHex(h);
  };

  const rgb = hsvToRgb(hsva);
  const solid = toHex({ ...rgb, a: 1 }, false);

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = area.current!.getBoundingClientRect();
    commit({ ...hsva, s: clamp((e.clientX - r.left) / r.width), v: clamp(1 - (e.clientY - r.top) / r.height) });
  };
  const onAreaKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    commit({ ...hsva, s: clamp(hsva.s + m[0]), v: clamp(hsva.v + m[1]) });
  };

  // Checked after hydration, so the server and the first browser render show the same buttons
  const isClient = useIsClient();
  const hasEyeDropper = showEyedropper && isClient && 'EyeDropper' in window;
  const pickFromScreen = async () => {
    try {
      const Ctor = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const { sRGBHex } = await new Ctor().open();
      const parsed = parseHex(sRGBHex);
      if (parsed) commit({ ...rgbToHsv(parsed), a: hsva.a });
    } catch {
      // Cancelled with Escape.
    }
  };

  const hsl = rgbToHsl(rgb);
  const num = (n: number, max: number, set: (n: number) => void, label: string) => (
    <Input
      size="sm"
      aria-label={label}
      inputMode="numeric"
      className={styles.numberField}
      value={String(Math.round(n))}
      onChange={(e) => {
        const v = Number(e.target.value.replace(/[^\d]/g, ''));
        if (!Number.isNaN(v)) set(Math.min(max, v));
      }}
    />
  );

  return (
    <div ref={ref} {...rest} {...part('root', [styles.picker, className], rest.style)}>
      <div
        ref={area}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
        {...part('area', styles.area, { '--hue': `hsl(${hsva.h} 100% 50%)` } as CSSProperties)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
        onKeyDown={onAreaKey}
      >
        <span {...part('thumb', styles.thumb, { left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: solid })} />
      </div>

      <div {...part('sliders', styles.sliders)}>
        {hasEyeDropper && (
          <CompactButton variant="ghost" aria-label="Pick a colour from the screen" onClick={pickFromScreen}>
            <Icon name="Eyedropper" />
          </CompactButton>
        )}
        <div className={styles.tracks}>
          <input
            type="range"
            aria-label="Hue"
            min={0}
            max={359}
            value={Math.round(hsva.h)}
            {...part('track', [styles.track, styles.hue])}
            onChange={(e) => commit({ ...hsva, h: Number(e.target.value) })}
          />
          {showOpacity && (
            <input
              type="range"
              aria-label="Opacity"
              min={0}
              max={100}
              value={Math.round(hsva.a * 100)}
              aria-valuetext={`${Math.round(hsva.a * 100)}%`}
              {...part('track', [styles.track, styles.alpha], { '--solid': solid } as CSSProperties)}
              onChange={(e) => commit({ ...hsva, a: Number(e.target.value) / 100 })}
            />
          )}
        </div>
      </div>

      <div {...part('values', styles.values)}>
        <Select
          size="sm"
          aria-label="Colour format"
          {...part('format', styles.format)}
          value={format}
          onValueChange={(f) => setFormat(f as ColorFormat)}
          options={[
            { value: 'hex', label: 'HEX' },
            { value: 'rgb', label: 'RGB' },
            { value: 'hsl', label: 'HSL' },
          ]}
        />
        <div {...part('fields', styles.fields)}>
          {format === 'hex' && <HexField value={solid} onCommit={(rgba) => commit({ ...rgbToHsv(rgba), a: hsva.a })} />}
          {format === 'rgb' && (
            <>
              {num(rgb.r, 255, (r) => commit({ ...rgbToHsv({ ...rgb, r }), a: hsva.a }), 'Red')}
              {num(rgb.g, 255, (g) => commit({ ...rgbToHsv({ ...rgb, g }), a: hsva.a }), 'Green')}
              {num(rgb.b, 255, (b) => commit({ ...rgbToHsv({ ...rgb, b }), a: hsva.a }), 'Blue')}
            </>
          )}
          {format === 'hsl' && (
            <>
              {num(hsl.h, 359, (h) => commit({ ...rgbToHsv(hslToRgb(h, hsl.s, hsl.l)), h, a: hsva.a }), 'Hue')}
              {num(hsl.s * 100, 100, (s) => commit({ ...rgbToHsv(hslToRgb(hsl.h, s / 100, hsl.l)), a: hsva.a }), 'Saturation')}
              {num(hsl.l * 100, 100, (l) => commit({ ...rgbToHsv(hslToRgb(hsl.h, hsl.s, l / 100)), a: hsva.a }), 'Lightness')}
            </>
          )}
        </div>
        {showOpacity && (
          <Input
            size="sm"
            aria-label="Opacity percent"
            inputMode="numeric"
            className={styles.opacityField}
            value={`${Math.round(hsva.a * 100)}%`}
            onChange={(e) => {
              const v = Number(e.target.value.replace(/[^\d]/g, ''));
              if (!Number.isNaN(v)) commit({ ...hsva, a: clamp(v / 100) });
            }}
          />
        )}
      </div>

      {swatches && swatches.length > 0 && (
        <div {...part('swatches', styles.swatches)} role="group" aria-label="Swatches">
          {swatches.map((s) => (
            <ColorSwatch
              key={s}
              color={s}
              size="sm"
              aria-label={s}
              selected={s.toUpperCase() === solid}
              onClick={() => {
                const parsed = parseHex(s);
                if (parsed) commit({ ...rgbToHsv(parsed), a: hsva.a });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

/** A hex input that only updates the colour once the text is a valid colour. */
function HexField({ value, onCommit }: { value: string; onCommit: (rgba: { r: number; g: number; b: number; a: number }) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <Input
      size="sm"
      aria-label="Hex"
      className={styles.hexField}
      value={text}
      spellCheck={false}
      onChange={(e) => {
        setText(e.target.value);
        const parsed = parseHex(e.target.value);
        if (parsed && e.target.value.replace('#', '').length >= 6) onCommit(parsed);
      }}
      onBlur={() => setText(value)}
    />
  );
}

/* ---------- Field ---------- */

/** Parts of the colour box you can style with `classNames` and `styles`. */
export type ColorInputPart = 'root' | 'swatch' | 'input' | 'popover' | 'picker';

export interface ColorFieldProps extends Omit<ColorPickerProps, 'id' | 'classNames' | 'styles'>, PartsProps<ColorInputPart> {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  /** Form field name. The text box carries the hex. */
  name?: string;
  required?: boolean;
}

/** A box showing a colour and its hex. The swatch opens a ColorPicker. Figma: Color field. */
export const ColorInput = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorInput(
  { value, defaultValue = '#CC1DD0', onValueChange, size = 'md', disabled, invalid, id, showOpacity, showEyedropper, swatches, defaultFormat, className, classNames, styles: partStyles, name, required, ...aria },
  ref,
) {
  const part = parts<ColorInputPart>('color-input', { classNames, styles: partStyles });
  const [hex, setHex] = useControllable(value, defaultValue, onValueChange);
  const [text, setText] = useState(hex);
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const box = useRef<HTMLDivElement | null>(null);
  const swatch = useRef<HTMLButtonElement | null>(null);
  const { floating, style } = useFloating(box, open, { align: 'start' });
  useDismiss(open, () => setOpen(false), [box, floating]);
  useEffect(() => setText(hex), [hex]);
  useEffect(() => {
    if (open) floating.current?.querySelector<HTMLElement>('[role="slider"]')?.focus();
  }, [open, floating]);

  return (
    <>
      <div ref={box} {...part('root', [inputStyles.box, inputStyles[size], (invalid || aria['aria-invalid']) && inputStyles.invalid, disabled && inputStyles.disabled, className])}>
        <ColorSwatch
          ref={swatch}
          color={hex}
          shape="circle"
          size="sm"
          disabled={disabled}
          aria-label="Open colour picker"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          onClick={() => setOpen(!open)}
          {...part('swatch')}
        />
        <input
          ref={mergeRefs(ref)}
          id={id}
          name={name}
          aria-required={required || undefined}
          {...part('input', inputStyles.input)}
          value={text}
          disabled={disabled}
          spellCheck={false}
          aria-label={aria['aria-label']}
          aria-describedby={aria['aria-describedby']}
          aria-invalid={invalid || aria['aria-invalid'] || undefined}
          onChange={(e) => {
            setText(e.target.value);
            if (parseHex(e.target.value) && e.target.value.replace('#', '').length >= 6) setHex(toHex(parseHex(e.target.value)!));
          }}
          onBlur={() => setText(hex)}
        />
        <StatusIcon invalid={invalid || !!aria['aria-invalid']} disabled={disabled} />
      </div>
      {open && (
        <Portal>
          <div
            ref={floating}
            id={dialogId}
            role="dialog"
            aria-label="Colour picker"
            {...part('popover', styles.popover, style)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') swatch.current?.focus();
            }}
          >
            <ColorPicker {...part('picker')} value={hex} onValueChange={setHex} showOpacity={showOpacity} showEyedropper={showEyedropper} swatches={swatches} defaultFormat={defaultFormat} />
          </div>
        </Portal>
      )}
    </>
  );
});

export type ColorFieldWithLabelProps = Omit<ColorFieldProps, 'aria-describedby' | 'aria-invalid'> &
  Pick<FieldProps, 'label' | 'hint' | 'error' | 'optional' | 'info'> & { required?: boolean } & Pick<FieldWrapperProps, 'fieldClassName' | 'fieldClassNames' | 'fieldStyles'>;

/** A ColorInput with a label and hint. */
export const ColorField = forwardRef<HTMLInputElement, ColorFieldWithLabelProps>(function ColorField(
  { label, hint, error, optional, info, required, id, fieldClassName, fieldClassNames, fieldStyles, ...rest },
  ref,
) {
  return (
    <Field name={(rest as { name?: string }).name} label={label} hint={hint} error={error} required={required} optional={optional} info={info} controlId={id} className={fieldClassName} classNames={fieldClassNames} styles={fieldStyles}>
      {(c) => <ColorInput ref={ref} {...rest} {...c} />}
    </Field>
  );
});
