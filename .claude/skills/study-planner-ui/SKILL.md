---
name: study-planner-ui
description: Regras vinculantes do frontend do Study Planner — tokens visuais, faixas de cor do score, contrato real da API, fronteira de mock, estrutura de pastas e não-objetivos do produto. Use ao criar ou revisar qualquer tela, componente, estilo ou chamada de API em web/.
---

# Study Planner — regras do frontend

Fonte de verdade: `front.md` (design system) e `plan.md` (produto), ambos na raiz.
Este arquivo é o resumo executável. Em caso de conflito, `front.md` vence — e me diga.

## Pergunta que o produto responde

> Entre tudo que eu preciso fazer, o que merece mais atenção agora?

A Home é um **ranking**, não um dashboard. Toda decisão de UI se justifica por essa frase.

## Tokens — usar SEMPRE via token, nunca hex solto

| Token | Valor | Uso |
|---|---|---|
| `--color-brand` | `#16A34A` | **só o que é gráfico**: logo, ícone, anel de foco, item ativo |
| `--color-brand-strong` | `#15803D` | **preenchimento do botão primário**, texto da marca |
| `--color-brand-deep` | `#166534` | hover do botão primário |
| `--color-brand-subtle` | `#DCFCE7` | badge, fundo do nav ativo |
| `--color-surface` | `#FFFFFF` | cards, forms, listagens |
| `--color-background` | `#F8FAF9` | fundo geral |

**Por que o botão primário não é `#16A34A`:** branco sobre ele dá **3.30:1** e reprova AA (4.5:1).
A marca continua sendo `#16A34A` onde 3:1 basta (ícone, logo, anel de foco); o botão usa
`brand-strong` (5.02:1) e o hover `brand-deep` (7.13:1). Isso é verificado por
`src/lib/design/contrast.test.ts`, que lê o `globals.css` como fonte de verdade — mudar um
token e quebrar contraste derruba o `pnpm test`.

Hex literal em componente = bug. Espaçamento e raio saem da escala do Tailwind, não de valores arbitrários (`p-[13px]` é bug).

## Faixas de score

| Score | Token | Rótulo (PT-BR) |
|---|---|---|
| 0–19 | `blue-500` | Tranquilo |
| 20–39 | `green-500` | Baixa prioridade |
| 40–59 | `yellow-500` | Atenção |
| 60–79 | `orange-500` | Alta prioridade |
| 80–100 | `red-500` | Urgente |

Regras:
- A cor de score aparece só em: bolinha, badge, borda lateral fina, fundo levíssimo do badge, texto do score.
- **Nunca pintar o card inteiro.** O card é branco.
- O verde da marca e o `green-500` da faixa 20–39 são coisas diferentes. Não misturar tokens.
- Uma única função decide faixa/cor/rótulo: `lib/domain/score.ts`. Nenhum componente reimplementa isso.

## Contrato real da API (verificado no backend, não no plan.md)

Só existem duas rotas:

- `POST /tasks` → 201. Body: `title`, `description?`, `importance`, `domain`, `urgency`, `relevance` (int 1–10), `resources?[]`. Retorna a task **com** `resources`.
- `GET /tasks/list` → 200, `Task[]` ordenado por `score desc`. **Sem** `resources` (não tem `include`).

Detalhes que quebram na prática:
- A rota é `/tasks/list`, não `/tasks`.
- `resource.url` é `z.string().url()`: **omitir** a chave quando vazia, nunca mandar `""`.
- Erro de validação: `400 { message: "Validation failed", errors: ZodIssue[] }` — mapear por `issue.path` no formulário.
- Sem CORS no backend. O acesso é via rewrite `/api/* → localhost:3000/*` do Next. Nunca chamar `localhost:3000` direto.

### Score

```
round((importance*0.3 + (10-domain)*0.3 + urgency*0.2 + relevance*0.2) * 10)
```

Domínio é **invertido**: domina mais → prioridade menor. Espelhado em `lib/domain/initial-score.ts` **só para preview**; o valor persistido é sempre o que a API devolveu. Faixa real na criação: **7–97**, verificada exaustivamente em `initial-score.test.ts`. O mínimo vem de domínio=10, que zera a parcela invertida. Azul é alcançável; 98–100 só via aumento manual.

Produtividade: `score * (1 - p/100)`. Aumento: `min(100, score * (1 + a/100))`.

## Fronteira de mock

`lib/api/` é a única pasta que sabe o que é real e o que é mock. Nenhuma tela importa de `lib/api/mock/`.

Real: `listTasks`, `createTask`. Overlay local: `getTask`, `listResources`, contagem de recursos, `updateTask`, `deleteTask`, `registerProductivity`, `increasePriority`.

Toda função mockada leva `// TODO(api): trocar por <MÉTODO> <ROTA>` e já tem a assinatura do endpoint futuro.

## Estados obrigatórios

Toda tela que busca dados entrega os quatro: **loading (skeleton, não spinner)**, **vazio**, **erro com botão de tentar novamente**, **sucesso**. Toda mutação dá feedback (toast) e invalida a query certa.

## Não fazer

Calendário, agenda, kanban, prazo, status de task, duração, timer obrigatório, gráficos, gamificação, autenticação, IA, dashboard de widgets, gradiente exagerado, neon.

## Checklist antes de dar um componente por pronto

- [ ] Zero hex/px arbitrário — só tokens
- [ ] Funciona em 360 / 768 / 1440
- [ ] Navegável por teclado, `focus-visible` visível, `aria-*` onde precisa
- [ ] Label associado a todo input
- [ ] Contraste AA
- [ ] Estados de loading/vazio/erro cobertos
- [ ] Textos em PT-BR, tom direto, sem jargão
- [ ] `tsc --noEmit`, `oxlint`, `vitest run` e `next build` passando
