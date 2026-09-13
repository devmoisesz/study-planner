import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeTone = 'neutral' | 'brand';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-background text-ink-soft border-line',
  brand: 'bg-brand-subtle text-brand-strong border-brand/15',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-2xs font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
