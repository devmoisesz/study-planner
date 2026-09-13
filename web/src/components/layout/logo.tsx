import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
  /** Permite esconder o nome por breakpoint, ex.: "sr-only lg:not-sr-only". */
  nameClassName?: string;
}

/** A marca e o proprio conceito: tres barras decrescentes, o ranking. */
export function Logo({ className, nameClassName }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 32 32" aria-hidden className="size-7 shrink-0">
        <rect width="32" height="32" rx="8" className="fill-brand" />
        <rect x="8" y="8" width="16" height="4" rx="2" fill="#fff" />
        <rect x="8" y="14" width="11" height="4" rx="2" fill="#fff" opacity=".8" />
        <rect x="8" y="20" width="6" height="4" rx="2" fill="#fff" opacity=".55" />
      </svg>
      <span
        className={cn(
          'font-display text-lg font-bold leading-tight tracking-tight text-brand-strong',
          nameClassName,
        )}
      >
        Study Planner
      </span>
    </span>
  );
}
