import { forwardRef, useId, useRef, useState } from 'react';
import type { DragEvent, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon } from '../../internal/Icon';
import { Button } from '../Button';
import { CompactButton } from '../CompactButton';
import { ProgressBar } from '../Progress';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import styles from './FileUpload.module.css';

/** Turns a byte count into "2.4 MB". */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n < 10 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
}

export function accepts(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r);
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1));
    return file.type === r;
  });
}

/** Parts you can style with `classNames` and `styles`. */
export type FileUploadPart = 'root' | 'icon' | 'text' | 'title' | 'description' | 'button';

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onError'>, PartsProps<FileUploadPart> {
  /** Called with the files that pass `accept` and `maxSize`. */
  onFiles: (files: File[]) => void;
  /** Called with files that were turned away and why. */
  onReject?: (rejected: { file: File; reason: 'type' | 'size' }[]) => void;
  /** File types, like "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  /** Largest file size in bytes. */
  maxSize?: number;
  disabled?: boolean;
  /** Shows a red border and this message. Figma: State=Error. */
  error?: ReactNode;
  /** Figma: Title. */
  title?: ReactNode;
  /** Say which files are allowed and how big. Figma: Description. */
  description?: ReactNode;
  /** Figma: Change icon. */
  icon?: ReactNode;
  buttonLabel?: string;
}

/** A drop area for files, with a button to browse. Works with the keyboard through the button. */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    onFiles,
    onReject,
    accept,
    multiple = true,
    maxSize,
    disabled,
    error,
    title = 'Drag files here',
    description,
    icon,
    buttonLabel = 'Browse files',
    className,
    classNames,
    styles: partStyles,
    ...rest
  },
  ref,
) {
  const part = parts<FileUploadPart>('file-upload', { classNames, styles: partStyles });
  const input = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);
  const descId = useId();

  const take = (list: FileList | null) => {
    if (!list || disabled) return;
    const files = [...list].slice(0, multiple ? undefined : 1);
    const rejected: { file: File; reason: 'type' | 'size' }[] = [];
    const ok = files.filter((file) => {
      if (!accepts(file, accept)) rejected.push({ file, reason: 'type' });
      else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: 'size' });
      else return true;
      return false;
    });
    if (ok.length) onFiles(ok);
    if (rejected.length) onReject?.(rejected);
  };
  const onDrag = (e: DragEvent, entering: boolean) => {
    e.preventDefault();
    if (!disabled) setOver(entering);
  };

  return (
    <div
      ref={ref}
      onDragEnter={(e) => onDrag(e, true)}
      onDragOver={(e) => onDrag(e, true)}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onDrag(e, false);
      }}
      onDrop={(e) => {
        onDrag(e, false);
        take(e.dataTransfer.files);
      }}
      {...rest}
      data-disabled={disabled || undefined}
      {...part('root', [styles.drop, over && styles.over, !!error && styles.error, disabled && styles.disabled, className], rest.style)}
    >
      <span {...part('icon', styles.iconWrap)} aria-hidden="true">
        {icon ?? <Icon name="CloudArrowUp" />}
      </span>
      <div {...part('text', styles.text)}>
        <div {...part('title', styles.title)}>{title}</div>
        {(description || error) && (
          <div id={descId} {...part('description', [styles.description, !!error && styles.errorText])}>
            {error || description}
          </div>
        )}
      </div>
      <Button {...part('button')} variant="secondary" size="sm" disabled={disabled} aria-describedby={description || error ? descId : undefined} onClick={() => input.current?.click()}>
        {buttonLabel}
      </Button>
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          take(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
});

/** Parts you can style with `classNames` and `styles`. */
export type FileItemPart = 'root' | 'icon' | 'body' | 'name' | 'meta' | 'details' | 'actions';

export interface FileItemProps extends HTMLAttributes<HTMLDivElement>, PartsProps<FileItemPart> {
  name: string;
  /** Size in bytes. */
  size?: number;
  /** Figma: State. */
  status?: 'uploading' | 'complete' | 'error';
  /** Upload progress from 0 to 100. */
  progress?: number;
  /** Message for the error state. */
  error?: ReactNode;
  /** Figma: Change L icon. Defaults to a file icon. */
  icon?: ReactNode;
  onCancel?: () => void;
  onRemove?: () => void;
  onRetry?: () => void;
}

/** One file in an upload list: progress while uploading, then done or failed. */
export const FileItem = forwardRef<HTMLDivElement, FileItemProps>(function FileItem(
  { name, size, status = 'complete', progress = 0, error = 'Upload failed. Try again.', icon, onCancel, onRemove, onRetry, className, classNames, styles: partStyles, ...rest },
  ref,
) {
  const part = parts<FileItemPart>('file-item', { classNames, styles: partStyles });
  const sizeText = size !== undefined ? formatBytes(size) : undefined;
  const details =
    status === 'uploading'
      ? [size !== undefined ? `${formatBytes((size * progress) / 100)} of ${sizeText}` : undefined, `${Math.round(progress)}%`].filter(Boolean).join(' · ')
      : status === 'complete'
        ? [sizeText, 'Uploaded'].filter(Boolean).join(' · ')
        : error;
  return (
    <div ref={ref} {...rest} {...part('root', [styles.item, status === 'error' && styles.itemError, className], rest.style)}>
      <span {...part('icon', styles.fileIcon)} aria-hidden="true">{icon ?? <Icon name="File" />}</span>
      <div {...part('body', styles.body)}>
        <div {...part('name', styles.name)}>{name}</div>
        <div {...part('meta', styles.meta)} aria-live="polite">
          {status === 'complete' && <Icon name="CheckCircle" className={cx(styles.statusIcon, styles.positive)} />}
          {status === 'error' && <Icon name="WarningCircle" className={cx(styles.statusIcon, styles.negative)} />}
          <span {...part('details', [styles.details, status === 'error' && styles.errorText])}>{details}</span>
        </div>
        {status === 'uploading' && <ProgressBar size="sm" value={progress} valueLabel={false} aria-label={`Uploading ${name}`} />}
      </div>
      <div {...part('actions', styles.actions)}>
        {status === 'uploading' && onCancel && (
          <CompactButton variant="ghost" size="md" aria-label={`Cancel upload of ${name}`} onClick={onCancel}>
            <Icon name="X" />
          </CompactButton>
        )}
        {status === 'error' && onRetry && (
          <CompactButton variant="ghost" size="md" aria-label={`Retry ${name}`} onClick={onRetry}>
            <Icon name="ArrowClockwise" />
          </CompactButton>
        )}
        {status !== 'uploading' && onRemove && (
          <CompactButton variant="ghost" size="md" aria-label={`Remove ${name}`} onClick={onRemove}>
            <Icon name="Trash" />
          </CompactButton>
        )}
      </div>
    </div>
  );
});
