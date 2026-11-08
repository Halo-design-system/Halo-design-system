import { forwardRef, useId, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../internal/Icon';
import { parts } from '../../internal/parts';
import type { PartsProps } from '../../internal/parts';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { accepts } from './FileUpload';
import styles from './FileUpload.module.css';

/** Parts you can style with `classNames` and `styles`. */
export type ImageUploadPart = 'root' | 'image' | 'content' | 'title' | 'hint' | 'actions' | 'upload' | 'remove';

export interface ImageUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onError'>, PartsProps<ImageUploadPart> {
  /** The current picture. Leave it out to show the empty circle. Figma: State. */
  src?: string;
  /** Who or what the picture shows, for screen readers. */
  name?: string;
  /** Called with the chosen file if it passes `accept` and `maxSize`. */
  onFile: (file: File) => void;
  /** Called when the picture is removed. Leave it out to hide the remove button. */
  onRemove?: () => void;
  /** Called with a file that was turned away and why. */
  onReject?: (file: File, reason: 'type' | 'size') => void;
  /** The icon in the empty circle: a person, or a building for a company. Figma: Kind. */
  kind?: 'person' | 'business';
  /** `default` has a title and hint. `compact` is a smaller picture and the buttons. Figma: Layout. */
  layout?: 'default' | 'compact';
  title?: ReactNode;
  /** Say which files are allowed and how big. */
  hint?: ReactNode;
  /** File types, like "image/png,image/jpeg". */
  accept?: string;
  /** Largest file size in bytes. */
  maxSize?: number;
  disabled?: boolean;
  uploadLabel?: string;
  changeLabel?: string;
  removeLabel?: string;
}

/** One picture, like a profile photo or a company logo, in a circle with buttons to upload, change and remove it. */
export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(function ImageUpload(
  {
    src,
    name,
    onFile,
    onRemove,
    onReject,
    kind = 'person',
    layout = 'default',
    title = 'Upload image',
    hint = 'Min 400×400px, PNG or JPEG',
    accept = 'image/png,image/jpeg',
    maxSize,
    disabled,
    uploadLabel = 'Upload',
    changeLabel = 'Change',
    removeLabel = 'Remove image',
    className,
    classNames,
    styles: partStyles,
    ...rest
  },
  ref,
) {
  const part = parts<ImageUploadPart>('image-upload', { classNames, styles: partStyles });
  const input = useRef<HTMLInputElement | null>(null);
  const hintId = useId();
  const compact = layout === 'compact';

  const take = (file: File | undefined) => {
    if (!file || disabled) return;
    if (!accepts(file, accept)) onReject?.(file, 'type');
    else if (maxSize !== undefined && file.size > maxSize) onReject?.(file, 'size');
    else onFile(file);
  };

  const actions = (
    <div {...part('actions', [styles.imageActions, !compact && styles.imageActionsSpaced])}>
      <Button {...part('upload')} variant="secondary" size="sm" disabled={disabled} aria-describedby={hintId} onClick={() => input.current?.click()}>
        {src ? changeLabel : uploadLabel}
      </Button>
      {src && onRemove && (
        <Tooltip content={removeLabel}>
          <Button {...part('remove', styles.imageRemove)} variant="ghost" size="sm" iconOnly disabled={disabled} aria-label={removeLabel} onClick={onRemove}>
            <Icon name="Trash" />
          </Button>
        </Tooltip>
      )}
    </div>
  );

  return (
    <div ref={ref} {...rest} {...part('root', [styles.image, className], rest.style)}>
      <Avatar {...part('image')} src={src} name={src ? name : undefined} size={compact ? 'lg' : 'xl'} icon={kind === 'business' ? <Icon name="Buildings" /> : undefined} />
      {compact ? (
        <>
          <span id={hintId} hidden>
            {title}. {hint}
          </span>
          {actions}
        </>
      ) : (
        <div {...part('content', styles.imageContent)}>
          <div {...part('title', styles.title)}>{title}</div>
          <div id={hintId} {...part('hint', styles.description)}>
            {hint}
          </div>
          {actions}
        </div>
      )}
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
});
