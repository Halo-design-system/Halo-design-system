import { useRef } from 'react';
import { CompactButton, Input } from '@halo-ds/react';
import type { InputSize } from '@halo-ds/react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

/** A search field with a clear button at the end, once there is something to clear. */
export function SearchBox({ value, onChange, label, placeholder, size }: { value: string; onChange: (value: string) => void; label: string; placeholder: string; size?: InputSize }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <Input
      ref={input}
      size={size}
      aria-label={label}
      placeholder={placeholder}
      iconLeft={<MagnifyingGlass />}
      iconRight={
        value ? (
          <CompactButton
            variant="ghost"
            size="md"
            round
            aria-label="Clear search"
            onClick={() => {
              onChange('');
              input.current?.focus();
            }}
          >
            <X />
          </CompactButton>
        ) : undefined
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
