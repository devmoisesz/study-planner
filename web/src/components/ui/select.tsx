'use client';

import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { useFieldControl } from '@/components/ui/field';
import { cn } from '@/lib/utils/cn';

/** Select nativo — acessivel de graca no mobile e no teclado. */
export function Select({
  className,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const field = useFieldControl();

  return (
    <div className="relative">
      <select
        id={id ?? (field.controlId || undefined)}
        aria-describedby={field.describedBy}
        aria-invalid={field.invalid || undefined}
        aria-required={field.required || undefined}
        className={cn(
          'h-10 w-full appearance-none rounded-sm border bg-surface pl-3 pr-9 text-sm text-ink transition-colors',
          'hover:border-ink-faint/60',
          'disabled:cursor-not-allowed disabled:bg-background disabled:text-ink-soft',
          field.invalid ? 'border-danger' : 'border-line',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
      />
    </div>
  );
}
