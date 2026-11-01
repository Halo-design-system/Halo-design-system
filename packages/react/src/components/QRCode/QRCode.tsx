import { forwardRef, useMemo } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Icon } from '../../internal/Icon';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { encodeQR } from './qr';
import type { QRErrorLevel } from './qr';
import styles from './QRCode.module.css';

export type { QRErrorLevel };

export interface QRCodeLabels {
  expired: string;
  refresh: string;
  scanned: string;
  scannedHint: string;
}

const LABELS: QRCodeLabels = { expired: 'Code expired', refresh: 'Refresh', scanned: 'Scanned', scannedHint: 'Confirm on your phone' };

/** Parts you can style with `classNames` and `styles`. */
export type QRCodePart = 'root' | 'code' | 'logo' | 'overlay' | 'message';

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, PartsProps<QRCodePart> {
  /** The text or link to encode. Up to about 2,900 characters at level L. */
  value: string;
  /** Width and height in px, including the light border. Figma: Size. */
  size?: number;
  /**
   * How much of the code can be covered or damaged and still scan: L 7%, M 15%, Q 25%, H 30%.
   * Higher levels make denser codes. Defaults to M, or H when there is a logo.
   */
  level?: QRErrorLevel;
  /** The light border around the code, in modules. Scanners need 4; go lower only on a plain light background. */
  margin?: number;
  /** A small logo or icon in the middle, like an app icon. Keep it under a fifth of the width. Figma: Logo. */
  logo?: ReactNode;
  /**
   * Covers the code while it is being made, when it has run out (for sign-in codes that expire),
   * or once a phone has scanned it and people need to finish on their phone. Figma: State.
   */
  status?: 'active' | 'loading' | 'expired' | 'scanned';
  /** Shows a Refresh button on an expired code. */
  onRefresh?: () => void;
  /**
   * Colour of the dark squares. Any CSS colour. Keep it dark and the background light,
   * with strong contrast between them, or some phones will not read the code.
   */
  color?: string;
  /** Colour behind the code, including the light border. Any CSS colour. */
  bgColor?: string;
  /** Text on the expired and scanned covers, for other languages. */
  labels?: Partial<QRCodeLabels>;
  /** What the code is for, read by screen readers, like "Scan to sign in on your phone". */
  label: string;
}

/** A scannable QR code drawn as SVG, with no dependencies. It always stays dark on light, in dark mode too, so every phone can read it. Figma: QR code. */
export const QRCode = forwardRef<HTMLDivElement, QRCodeProps>(function QRCode(
  { value, size = 160, level, margin = 4, logo, status = 'active', onRefresh, color, bgColor, labels, label, className, style, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<QRCodePart>('qr-code', { classNames, styles: partStyles });
  const ecl = level ?? (logo ? 'H' : 'M');
  const text = { ...LABELS, ...labels };
  const colours = { ...(color && { '--qr-dark': color }), ...(bgColor && { '--qr-light': bgColor }) } as CSSProperties;
  const path = useMemo(() => {
    const modules = encodeQR(value, ecl);
    let d = '';
    modules.forEach((row, y) => {
      // One rectangle per run of dark modules keeps the path short.
      for (let x = 0; x < row.length; x++) {
        if (!row[x]) continue;
        let end = x;
        while (end + 1 < row.length && row[end + 1]) end++;
        d += `M${x + margin},${y + margin}h${end - x + 1}v1h${-(end - x + 1)}z`;
        x = end;
      }
    });
    return { d, count: modules.length + margin * 2 };
  }, [value, ecl, margin]);

  return (
    <div
      ref={ref}
      {...part('root', [styles.qr, status !== 'active' && styles.covered, className], { width: size, height: size, ...colours, ...style })}
      aria-busy={status === 'loading' || undefined}
      {...rest}
    >
      {/* The code is the image; buttons over it, like Refresh, stay outside the image so they can be reached */}
      <svg
        {...part('code', styles.code)}
        viewBox={`0 0 ${path.count} ${path.count}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        role="img"
        aria-label={status === 'expired' ? `${label}. ${text.expired}.` : status === 'scanned' ? `${label}. ${text.scanned}. ${text.scannedHint}.` : label}
      >
        <rect width={path.count} height={path.count} className={styles.light} />
        <path d={path.d} className={styles.dark} />
      </svg>
      {logo && status === 'active' && (
        <span {...part('logo', styles.logo, { width: size * 0.22, height: size * 0.22 })} aria-hidden="true">
          {logo}
        </span>
      )}
      {status === 'loading' && (
        <span {...part('overlay', styles.overlay)}>
          <Spinner size="md" label="" />
        </span>
      )}
      {status === 'expired' && (
        <span {...part('overlay', styles.overlay)}>
          <span {...part('message', styles.message)}>{text.expired}</span>
          {onRefresh && (
            <Button size={size < 140 ? 'xs' : 'sm'} variant="secondary" onClick={onRefresh}>
              {text.refresh}
            </Button>
          )}
        </span>
      )}
      {status === 'scanned' && (
        <span {...part('overlay', [styles.overlay, styles.scanned])} aria-live="polite">
          <Icon name="CheckCircle" className={styles.check} />
          <span {...part('message', styles.message)}>{text.scanned}</span>
          {size >= 140 && <span className={styles.hint}>{text.scannedHint}</span>}
        </span>
      )}
    </div>
  );
});
