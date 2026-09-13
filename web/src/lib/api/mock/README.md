# Overlay local — camada temporária

Esta pasta existe porque o backend ainda não expõe três operações que o MVP
precisa. Ela **não é um mock de dados**: nada aqui inventa tarefas.

## O que é real e o que é overlay

| Operação | Origem |
|---|---|
| `listTasks` | **API real** — `GET /tasks/list` (com `resourceCount`) |
| `createTask` | **API real** — `POST /tasks` |
| `deleteTask` | **API real** — `DELETE /tasks/:id` |
| `listResources` | **API real** — `GET /resources` |
| `getTask` | task do list + recursos do `GET /resources`, filtrados por id |
| `updateTask` | overlay |
| `registerProductivity`, `increasePriority` | overlay, com as fórmulas do `plan.md` |

## Rotas que faltam para apagar esta pasta

1. `GET /tasks/:id` — hoje `getTask` monta o resultado com duas chamadas reais.
2. `PATCH /tasks/:id` — edição de título e descrição.
3. `POST /tasks/:id/productivities` — a tabela `productivities` já existe no
   Prisma e nenhum código a usa ainda.
4. `POST /tasks/:id/priority-boost`.

Depois disso: trocar o corpo de cada função marcada com `TODO(api)` em
`../tasks.ts` por uma chamada `apiFetch` — as assinaturas já estão no formato
final — e apagar esta pasta.

Nenhum componente de tela importa daqui. A fronteira é `lib/api/`.
