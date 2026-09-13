import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'icon';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-strong text-white hover:bg-brand-deep active:bg-brand-deep',
  secondary: 'bg-surface text-ink border border-line hover:bg-background active:bg-background',
  ghost: 'text-ink-soft hover:bg-brand-subtle hover:text-brand-strong',
  danger: 'bg-surface text-danger border border-line hover:bg-danger-soft hover:border-danger/30',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  icon: 'size-10 shrink-0',
};

/**
 * Classes do botao, isoladas para que um <Link> possa se apresentar como
 * botao sem virar <button> dentro de <a>.
 */
export function buttonClasses({
  variant = 'secondary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium',
    'transition-colors duration-150',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Mostra spinner e bloqueia o clique sem tirar o botao do fluxo de foco. */
  isPending?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  isPending = false,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isPending}
      aria-busy={isPending || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {isPending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
