'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerAction } from '@/app/(auth)/actions';
import type { AuthActionState } from '@/app/(auth)/actions';
import {
  AuthFormMessage,
  AuthSubmitButton,
  PasswordInput,
} from '@/components/auth/auth-form-parts';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const INITIAL_STATE: AuthActionState = {};

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, INITIAL_STATE);

  return (
    <>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-strong">
          Comece agora
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
          Crie sua conta
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Leva menos de um minuto para montar seu espaço de estudos.
        </p>
      </div>

      <form action={action} noValidate className="flex flex-col gap-5">
        <AuthFormMessage message={state.message} />

        <Field label="Nome" required error={state.fieldErrors?.name}>
          <Input
            name="name"
            autoComplete="name"
            placeholder="Como podemos chamar você?"
            defaultValue={state.values?.name}
          />
        </Field>

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

        <Field
          label="Senha"
          required
          hint="Use pelo menos 8 caracteres."
          error={state.fieldErrors?.password}
        >
          <PasswordInput
            name="password"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            minLength={8}
          />
        </Field>

        <AuthSubmitButton>Criar minha conta</AuthSubmitButton>
      </form>

      <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
        Já possui uma conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-strong hover:text-brand-deep hover:underline"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
