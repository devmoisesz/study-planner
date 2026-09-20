'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginAction } from '@/app/(auth)/actions';
import type { AuthActionState } from '@/app/(auth)/actions';
import {
  AuthFormMessage,
  AuthSubmitButton,
  PasswordInput,
} from '@/components/auth/auth-form-parts';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const INITIAL_STATE: AuthActionState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, INITIAL_STATE);

  return (
    <>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
          Bem-vindo de volta
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
          Entre na sua conta
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Continue de onde parou e veja o que merece sua atenção hoje.
        </p>
      </div>

      <form action={action} noValidate className="flex flex-col gap-5">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <AuthFormMessage message={state.message} />

        <Field label="E-mail" required error={state.fieldErrors?.email}>
          <Input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            defaultValue={state.values?.email}
          />
        </Field>

        <Field label="Senha" required error={state.fieldErrors?.password}>
          <PasswordInput
            name="password"
            autoComplete="current-password"
            placeholder="Sua senha"
          />
        </Field>

        <AuthSubmitButton>Entrar</AuthSubmitButton>
      </form>

      <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
        Ainda não tem uma conta?{' '}
        <Link
          href="/cadastro"
          className="font-semibold text-brand-strong hover:text-brand-deep hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </>
  );
}
