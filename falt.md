# Study Planner — o que falta

Levantamento do estado real do repositório em **13/09/2026**, verificado no código
e em execução, não de memória.

Referências: [`plan.md`](./plan.md) (produto) e [`front.md`](./front.md) (design system).

---

## 1. Onde estamos

| Camada | Estado |
|---|---|
| Backend (NestJS + Prisma + Postgres) | 4 rotas, 13 testes |
| Frontend (Next 16 + Tailwind v4) | 5 telas completas, 105 testes |
| Integração | rewrite `/api/*` → `:3000`, sem CORS |

As 5 telas do MVP estão implementadas: Prioridades, Nova tarefa, Detalhes,
Recursos e Configurações.

---

## 2. Rotas que faltam

Existem hoje:

```
POST   /tasks          cria tarefa + recursos, calcula o score
GET    /tasks/list     ranking por score desc, com resourceCount
DELETE /tasks/:id      exclui (cascade nos recursos)
GET    /resources      lista materiais com taskTitle
```

Faltam **5**:

| # | Rota | Destrava | Onde está marcado |
|---|---|---|---|
| 1 | `GET /tasks/:id` | detalhe em 1 chamada | `web/src/lib/api/tasks.ts:88` |
| 2 | `PATCH /tasks/:id` | editar título/descrição | `web/src/lib/api/tasks.ts:104` |
| 3 | `POST /tasks/:id/productivities` | registrar progresso | `web/src/lib/api/tasks.ts:112` |
| 4 | `POST /tasks/:id/priority-boost` | aumento manual | `web/src/lib/api/tasks.ts:123` |
| 5 | `POST /resources/upload` | enviar PDF/imagem | `web/src/components/tasks/resource-fields.tsx:23` |

### Detalhes que importam

**3 e 4 já têm fórmula fechada** no `plan.md` §4 e §5, e o frontend já as tem
testadas. Os números precisam bater:

```
produtividade:  novoScore = score × (1 − p/100)          86 @ 55% → 39
aumento:        novoScore = min(100, score × (1 + a/100))  39 @ 50% → 59
```

A tabela `productivities` **já existe** no `schema.prisma` (`id`, `percentage`,
`taskId`, `createdAt`) e nenhum código a usa. A rota 3 é a primeira a escrever nela.

**1 não bloqueia tela nenhuma hoje** — `getTask` monta o resultado com duas
chamadas reais (`/tasks/list` + `/resources`) e filtra por `taskId`. É otimização,
não funcionalidade.

**5 tem decisão de produto embutida:** onde o arquivo fica. O `plan.md` §8 já
antecipa — armazenamento externo (ex.: Cloudinary) com o banco guardando só a
URL. O schema não muda: o upload devolve uma URL e ela vai no campo `url` do
recurso, que já existe.

---

## 3. O que ainda vive em `localStorage`

`web/src/lib/api/mock/store.ts` guarda **3 coisas**, todas por falta de rota:

```
scores          → produtividade e aumento manual
edits           → edição de título/descrição
productivities  → histórico de progresso
```

Em sessão limpa o overlay nasce vazio. Ele só se preenche quando você usa essas
três ações.

**Consequências hoje:** trocar de navegador ou de máquina perde essas alterações;
limpar dados do site restaura os scores originais do banco.

**Para apagar a pasta:** implementar as rotas 1 a 4 acima, trocar o corpo de cada
função marcada com `TODO(api)` em `web/src/lib/api/tasks.ts` por uma chamada
`apiFetch` — as assinaturas já estão no formato final — e deletar
`web/src/lib/api/mock/`. Nenhum componente de tela importa de lá.

---

## 4. Testes

| Escopo | Hoje |
|---|---|
| Backend unitário + e2e | 13 |
| Frontend domínio + camada de API | 88 |
| Frontend componentes | 17 (3 arquivos) |

### Lacuna real: componentes

**3 de 39 componentes** têm teste. Os cobertos são `TaskCard`, os diálogos de
score e os estados vazio/erro — as peças de maior risco. Sem teste, e valendo a
pena por ordem:

1. `create-task-form.tsx` — o formulário mais complexo do app: sliders, array
   dinâmico de recursos, mapeamento de erro 400 por campo
2. `tasks-view.tsx` — a máquina de estados carregando/vazio/erro/lista
3. `task-detail-view.tsx` — edição inline, histórico, 4 ações
4. `resource-fields.tsx` — campo de upload condicional ao tipo
5. `nav-links.tsx` / `mobile-nav.tsx` — o drawer e o item ativo

O restante (`badge`, `card`, `logo`, `content-container`…) é apresentação pura;
teste ali rende pouco.

### Fluxos ponta a ponta

Os 6 fluxos foram validados **manualmente via Playwright durante o
desenvolvimento**, mas **não há suíte e2e versionada no frontend**. Os scripts
eram descartáveis. Vale transformar em `web/e2e/` com `@playwright/test`:

- criar tarefa → aparece no ranking com o score do servidor
- produtividade → ranking reordena
- excluir → some do banco
- erro de rede → estado de erro + retry

---

## 5. Dívidas de configuração

### `tsconfig.json` da raiz sem `exclude`

Agora que `web/` existe, um `tsc --noEmit` direto na raiz tenta compilar o
frontend com a config do backend e falha. **Não afeta** `pnpm build` (o
`tsconfig.build.json` tem `include: ["src"]`), nem lint, nem testes — mas o
editor mostra erros falsos em `web/`.

```jsonc
// tsconfig.json
"exclude": ["web", "node_modules", "dist"]
```

### `oxlint.json` nunca é lido

O oxlint procura **`.oxlintrc.json`**. O arquivo na raiz se chama `oxlint.json`,
então a config do backend nunca foi carregada — a regra
`@typescript-eslint/no-floating-promises` jamais disparou. O `web/` já usa o nome
certo. Basta renomear:

```bash
mv oxlint.json .oxlintrc.json
```

### `tsconfig.build.tsbuildinfo` versionado

É cache de build, muda a cada `pnpm build` e suja o `git status`. Deveria estar
no `.gitignore` e sair do índice:

```bash
git rm --cached tsconfig.build.tsbuildinfo
echo "*.tsbuildinfo" >> .gitignore
```

### `pnpm-workspace.yaml` com sintaxe de outra versão

O arquivo usa `allowBuilds:`, que é do pnpm 12. Com pnpm 10 a chave é ignorada e
os build scripts do Prisma são pulados silenciosamente — foi preciso
`pnpm rebuild prisma @prisma/engines` na primeira instalação. Corrigir para
`onlyBuiltDependencies:` ou fixar a versão do pnpm no `packageManager`.

### Sem `.env.example`

O `.env` é (corretamente) ignorado, mas não há modelo. Quem clonar o repo não
descobre quais variáveis existem sem ler o `docker-compose.yml` e o
`prisma.config.ts`. Faltam: `POSTGRESQL_USERNAME`, `POSTGRESQL_PASSWORD`,
`POSTGRESQL_DATABASE`, `DATABASE_URL`.

### `README.md` vazio

0 bytes. Falta o básico: o que é o projeto, como subir o banco, instalar, rodar
migrations e iniciar back e front (portas 3000 e 3333).

### Sem CI

Não há `.github/`. Os gates já existem como scripts (`pnpm check` no frontend,
`lint`/`test`/`build` no backend) — falta só amarrá-los num workflow.

---

## 6. Fora do escopo do MVP

Registrado no `plan.md` §13 e reafirmado aqui para não virar escopo por engano:

status de tarefa · prazo · cronograma fixo · duração pré-definida · recuperação
automática do score · histórico completo de alterações do score · IA ·
gamificação · múltiplos usuários · autenticação.

O `front.md` §27 acrescenta: dashboard complexo, calendário, agenda semanal,
timer obrigatório, gráficos.

**A tela de Configurações lista 3 itens como "Ainda não disponível"** — ajustar
os pesos, preferências visuais e exportar tarefas. São ideias declaradas, não
compromissos.

---

## 7. Ordem sugerida

1. **`POST /tasks/:id/productivities`** — é o loop central do produto e a única
   das rotas que faltam que muda a experiência de verdade
2. **`PATCH`** e **`GET /tasks/:id`** — fecham a tela de Detalhes
3. **`POST /tasks/:id/priority-boost`** — completa o par de ações sobre o score
5. **Dívidas de configuração** — são minutos cada e param de atrapalhar
6. **Testes de componente** dos 5 arquivos listados na seção 4
