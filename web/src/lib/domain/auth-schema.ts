import { z } from 'zod';

const email = z
  .string()
  .trim()
  .email('Informe um e-mail válido.')
  .transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome.'),
  email,
  password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
