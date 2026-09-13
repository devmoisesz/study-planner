'use client';

import { Paperclip, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { useFieldControl } from '@/components/ui/field';
import { cn } from '@/lib/utils/cn';

interface FileInputProps {
  /** Tipos aceitos, no formato do atributo accept. */
  accept?: string;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Seletor de arquivo. Usa um <input type="file"> real (acessivel e nativo)
 * escondido atras de um botao, para nao depender do visual do browser.
 */
export function FileInput({ accept, disabled, onChange }: FileInputProps) {
  const field = useFieldControl();
  const fallbackId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const inputId = field.controlId || fallbackId;

  function update(next: File | null) {
    setFile(next);
    onChange?.(next);
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = '';
    update(null);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        aria-describedby={field.describedBy}
        className="sr-only"
        onChange={(event) => update(event.target.files?.[0] ?? null)}
      />

      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors',
          'hover:bg-background',
          // O label nao recebe :focus-visible; o anel vem do input irmao.
          'has-[+*]:outline-none',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Paperclip aria-hidden className="size-4 text-ink-faint" />
        {file ? 'Trocar arquivo' : 'Escolher arquivo'}
      </label>

      {file ? (
        <div className="flex items-center gap-2 rounded-sm border border-line bg-background px-3 py-2">
          <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
          <span className="tabular shrink-0 text-2xs text-ink-faint">{formatSize(file.size)}</span>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label={`Remover ${file.name}`}
            className="-mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-ink-faint transition-colors hover:bg-surface hover:text-ink"
          >
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
