# Overlay local — camada temporária

Esta pasta existe porque o backend ainda não expõe seis operações que o MVP
precisa. Ela **não é um mock de dados**: nada aqui inventa tarefas.

## O que é real e o que é overlay

| Operação | Origem |
|---|---|
| `listTasks` | **API real** — `GET /tasks/list` |
| `createTask` | **API real** — `POST /tasks` |
| `getTask` | task real do list + recursos do overlay |
| `listResources` | overlay, alimentado pela resposta real do `POST /tasks` |
| `updateTask`, `deleteTask` | overlay |
| `registerProductivity`, `increasePriority` | overlay, com as fórmulas do `plan.md` |

Os `resources` guardados aqui são exatamente os que o `POST /tasks` devolveu.
O que é local é a **leitura** deles, porque o `GET /tasks/list` não faz
`include: { resources: true }`.

## Como remover

1. Implementar no backend: `GET /tasks/:id`, `PATCH /tasks/:id`,
   `DELETE /tasks/:id`, `POST /tasks/:id/productivities`,
   `POST /tasks/:id/priority-boost`, `GET /resources`, e o `_count.resources`
   no list.
2. Em `../tasks.ts`, trocar o corpo de cada função marcada com `TODO(api)`
   por uma chamada `apiFetch`. As assinaturas já estão no formato final.
3. Apagar esta pasta.

Nenhum componente de tela importa daqui. A fronteira é `lib/api/`.
