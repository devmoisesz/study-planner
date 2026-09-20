'use client';

import { LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { logoutAction } from '@/app/(auth)/actions';
import { cn } from '@/lib/utils/cn';

function Submit({ compact }: { compact?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={compact ? 'Sair' : undefined}
      className={cn(
        'flex h-10 w-full items-center gap-3 rounded-md text-sm font-medium text-sidebar-ink transition-colors hover:bg-sidebar-surface hover:text-ink disabled:opacity-50',
        compact ? 'justify-center px-0 lg:justify-start lg:px-3' : 'px-3',
      )}
    >
      <LogOut aria-hidden className="size-[18px] shrink-0 text-sidebar-muted" />
      <span className={compact ? 'sr-only lg:not-sr-only' : ''}>
        {pending ? 'Saindo…' : 'Sair'}
      </span>
    </button>
  );
}

export function LogoutButton({ compact }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <Submit compact={compact} />
    </form>
  );
}
