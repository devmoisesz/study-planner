# FRONTEND — Study Planner / ORDo

## 1. Objetivo do frontend

O frontend deve representar visualmente a proposta principal do projeto:

> mostrar, de forma simples e rápida, o que merece mais atenção agora.

A aplicação não é um calendário rígido e não deve parecer um software complexo de gestão.

O foco visual deve estar em:

- ranking de tarefas;
- score de prioridade;
- cores de prioridade;
- leitura rápida;
- poucos elementos por tela;
- ações simples;
- recursos vinculados às tarefas;
- sensação de organização e clareza.

O usuário deve abrir a aplicação e imediatamente entender:

1. quais tarefas estão mais importantes;
2. qual o score de cada tarefa;
3. o que pode fazer em seguida.

---

## 2. Estilo visual

A identidade visual deve ter **verde como cor predominante**, combinada com bastante **branco ao redor e dentro das listagens**.

A interface deve ser:

- limpa;
- moderna;
- leve;
- organizada;
- minimalista;
- sem excesso de informações;
- sem aparência de dashboard corporativo pesado.

O branco deve ter forte presença nos cards, formulários e áreas de conteúdo.

---

## 3. Paleta sugerida

### Verde principal

```text
#16A34A
```

Pode ser usado em:

- logo;
- botões principais;
- item ativo da sidebar;
- ícones;
- estados de foco;
- pequenos destaques.

### Verde escuro

```text
#15803D
```

Usar em hover, estados ativos e detalhes de maior contraste.

### Verde claro

```text
#DCFCE7
```

Usar em backgrounds leves, badges e seleção da navegação.

### Branco

```text
#FFFFFF
```

Deve predominar principalmente:

- nos cards de task;
- nas listagens;
- nos formulários;
- ao redor das informações principais.

### Background geral

```text
#F8FAF9
```

ou outro cinza/esverdeado quase branco.

O objetivo é fazer os cards brancos se destacarem discretamente do fundo.

---

## 4. Cores do score

O verde principal é a identidade da aplicação. As cores abaixo representam exclusivamente a prioridade da task.

| Score | Cor | Significado |
|---|---|---|
| 0–19 | Azul | Tranquilo |
| 20–39 | Verde | Baixa prioridade |
| 40–59 | Amarelo | Atenção |
| 60–79 | Laranja | Alta prioridade |
| 80–100 | Vermelho | Urgente |

Sugestão:

```text
0–19   → blue-500
20–39  → green-500
40–59  → yellow-500
60–79  → orange-500
80–100 → red-500
```

A cor da prioridade pode aparecer em:

- bolinha indicadora;
- badge do score;
- pequena borda lateral;
- fundo muito leve do badge;
- texto do score.

Não pintar o card inteiro com a cor de prioridade. O card deve continuar predominantemente branco.

---

## 5. Layout geral

Estrutura de desktop:

```text
┌───────────────────────────────────────────────────────┐
│ Sidebar │                 Conteúdo                    │
│         │                                             │
│         │        Título da página                     │
│         │                                             │
│         │   ┌─────────────────────────────────────┐   │
│         │   │ Task                                │   │
│         │   └─────────────────────────────────────┘   │
│         │                                             │
│         │   ┌─────────────────────────────────────┐   │
│         │   │ Task                                │   │
│         │   └─────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

Usar uma largura máxima para o conteúdo principal, evitando listas esticadas por toda a tela.

---

## 6. Sidebar

A sidebar fica fixa à esquerda no desktop.

Estrutura inicial:

```text
ORDo

▣ Prioridades
＋ Nova tarefa
▤ Recursos
⚙ Configurações
```

`ORDo` pode ser tratado como nome provisório enquanto o nome final do projeto não for definido.

A sidebar deve ter:

- fundo branco;
- borda direita muito discreta;
- logo em verde;
- item ativo com fundo verde claro;
- texto/ícone ativo em verde;
- cantos arredondados nos itens.

---

## 7. Tela principal — Prioridades

Essa é a tela mais importante do sistema.

Título:

```text
Prioridades
```

Subtítulo opcional:

```text
Veja o que merece mais atenção agora.
```

As tasks devem ser exibidas ordenadas por:

```text
score DESC
```

Ou seja, maior score primeiro.

---

## 8. Card de Task

Cada task deve aparecer em um card branco, com respiro entre os elementos.

Exemplo:

```text
┌─────────────────────────────────────────────────────┐
│ 🔴 86                             Alta prioridade   │
│                                                     │
│ Estudar Trigonometria                              │
│ Ângulos notáveis e circunferência trigonométrica   │
│                                                     │
│ 3 recursos                                          │
│                                                     │
│ [Abrir]  [Produtividade]  [Aumentar prioridade] ⋯  │
└─────────────────────────────────────────────────────┘
```

Mostrar:

- score;
- indicador de prioridade;
- título;
- descrição, quando existir;
- quantidade de recursos;
- ações principais.

O score deve ser fácil de identificar visualmente.

A descrição deve ter menos destaque que o título. Se não existir, não reservar espaço vazio.

---

## 9. Ranking

A listagem deve comunicar que existe uma ordem de prioridade.

Exemplo:

```text
1.  🔴 86  Estudar Trigonometria
2.  🔴 81  Trabalho da ETEC
3.  🟠 73  Estudar Genética
4.  🟡 52  Simulado Fatec
5.  🟢 31  Revisar Guerra Fria
```

O número da posição é opcional. O essencial é manter a ordenação por score.

---

## 10. Branco ao redor das listagens

As listagens não devem ocupar toda a largura da página sem respiro.

Usar:

- padding externo;
- margem entre cards;
- largura máxima de conteúdo;
- fundo geral muito claro;
- cards brancos;
- bordas discretas;
- sombras leves.

Exemplo:

```text
background geral claro

        ┌───────────────────────────────┐
        │          card branco          │
        └───────────────────────────────┘

        ┌───────────────────────────────┐
        │          card branco          │
        └───────────────────────────────┘
```

A sensação deve ser de bastante espaço e limpeza visual.

---

## 11. Tela Nova Task

Título:

```text
Nova tarefa
```

Campos:

```text
Título *
Descrição

Importância        [1–10]
Domínio             [1–10]
Urgência            [1–10]
Relevância          [1–10]

Recursos (opcional)
```

### Explicações curtas

**Importância**

```text
Quanto essa tarefa é importante para você?
```

**Domínio**

```text
Quanto você já domina esse assunto?
```

Mostrar também:

```text
Quanto maior o domínio, menor tende a ser a prioridade.
```

**Urgência**

```text
Quanto essa tarefa precisa de atenção agora?
```

**Relevância**

```text
Quanto isso é relevante para sua prova ou objetivo?
```

---

## 12. Valores de 1 a 10

Evitar inputs de texto genéricos quando houver opção melhor.

Preferir:

- slider;
- stepper;
- botões numerados;
- input number bem apresentado.

Exemplo:

```text
Importância

1 ───────────────●──── 10
                  8
```

ou:

```text
[1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
```

---

## 13. Preview do score

Durante a criação, o frontend pode mostrar uma estimativa visual:

```text
Prioridade estimada

86 / 100
Urgente
```

Mas a fonte de verdade é o backend.

O score persistido deve ser o retornado pela API.

---

## 14. Resources na criação da Task

O endpoint `POST /tasks` aceita resources junto com a task.

O formulário deve permitir adicionar zero ou vários resources dinamicamente.

Exemplo:

```text
Recursos

┌──────────────────────────────────────┐
│ Título: Aula de Trigonometria        │
│ Tipo: YouTube                        │
│ URL: https://...                     │
│ Descrição: ...                       │
│                             [Remover] │
└──────────────────────────────────────┘

[+ Adicionar recurso]
```

Cada resource possui:

```text
title
type
url?
description?
```

Tipos permitidos:

```text
YOUTUBE
BOOK
PDF
WEBSITE
OTHER
```

Upload de PDF não faz parte do MVP atual.

---

## 15. Formulário de Resource

Campos:

```text
Título *
Tipo *
URL
Descrição
```

Exibir rótulos amigáveis:

```text
YOUTUBE → YouTube
BOOK    → Livro
PDF     → PDF
WEBSITE → Site
OTHER   → Outro
```

Para `BOOK`, URL pode ficar vazia.

---

## 16. Tela de detalhes da Task

Ao clicar em `Abrir`, mostrar os detalhes em página, drawer ou modal amplo.

Exemplo:

```text
Estudar Trigonometria

Score
86 / 100
Urgente

Descrição
Revisar ângulos notáveis e radianos.

Recursos

▶ Aula de Trigonometria
  YouTube

📖 Livro de Matemática
   Capítulo 8 — páginas 184–193

Ações

[Registrar produtividade]
[Aumentar prioridade]
[Editar]
[Excluir]
```

---

## 17. Registrar produtividade

Abrir modal ou drawer.

Exemplo:

```text
Registrar produtividade

Quanto você considera que avançou nesta tarefa?

[ 55 ] %

Score atual: 86
Novo score estimado: 39

[Cancelar] [Registrar]
```

Regra:

```text
novoScore = scoreAtual × (1 - produtividade / 100)
```

O frontend pode mostrar preview, mas a regra oficial permanece no backend.

---

## 18. Aumentar prioridade

Modal:

```text
Aumentar prioridade

Quanto deseja aumentar?

[ 50 ] %

Score atual: 39
Novo score estimado: 59

[Cancelar] [Aumentar prioridade]
```

Regra:

```text
novoScore = scoreAtual × (1 + aumento / 100)
```

O score máximo é 100.

---

## 19. Tela Recursos

A tela de Resources serve para consultar os materiais cadastrados.

Exemplo:

```text
Aula de Trigonometria
YouTube
Task: Estudar Trigonometria

Livro de Matemática
Livro
Task: Estudar Trigonometria

Resumo de genética
PDF
Task: Estudar Genética
```

No MVP, uma listagem simples é suficiente.

---

## 20. Configurações

Não precisa ser uma tela complexa no MVP.

Pode ficar preparada para futuramente suportar:

- pesos do score;
- preferências;
- configurações visuais.

Não criar funcionalidades que o backend ainda não suporte.

---

## 21. Componentes sugeridos

Estrutura aproximada:

```text
components/
├── layout/
│   ├── sidebar
│   ├── page-header
│   └── content-container
│
├── tasks/
│   ├── task-card
│   ├── task-list
│   ├── score-badge
│   ├── priority-badge
│   ├── create-task-form
│   ├── productivity-modal
│   └── increase-priority-modal
│
├── resources/
│   ├── resource-card
│   ├── resource-form
│   └── resource-list
│
└── ui/
    ├── button
    ├── input
    ├── textarea
    ├── select
    ├── modal
    └── empty-state
```

Os nomes podem ser adaptados à stack escolhida pelo Codex.

---

## 22. Estados da interface

### Loading

Preferir skeletons nas listas.

### Empty state

```text
Nenhuma tarefa cadastrada.

Crie sua primeira tarefa para começar a organizar suas prioridades.

[+ Nova tarefa]
```

### Erro

```text
Não foi possível carregar suas tarefas.

[Tentar novamente]
```

---

## 23. Responsividade

### Desktop

Sidebar fixa à esquerda e conteúdo central com largura máxima.

### Tablet

Sidebar pode ficar compacta.

### Mobile

Sidebar pode virar drawer/menu lateral.

Cards em coluna única.

Ações secundárias podem ser agrupadas no menu `...`.

---

## 24. Comportamento esperado da Home

Ao abrir a aplicação:

1. buscar as tasks;
2. exibir do maior score para o menor;
3. destacar visualmente as mais importantes;
4. manter os cards predominantemente brancos;
5. usar as cores de score apenas como reforço visual.

Não transformar a Home em um dashboard cheio de gráficos.

O ranking é o produto principal.

---

## 25. Formato conceitual de Task

Exemplo de resposta da API:

```json
{
  "id": "uuid",
  "title": "Estudar Trigonometria",
  "description": "Revisar ângulos notáveis",
  "score": 86,
  "resources": [
    {
      "id": "uuid",
      "title": "Aula de Trigonometria",
      "type": "YOUTUBE",
      "url": "https://youtube.com/...",
      "description": "Aula de revisão"
    }
  ],
  "createdAt": "2026-09-13T00:00:00.000Z",
  "updatedAt": "2026-09-13T00:00:00.000Z"
}
```

O frontend deve respeitar o contrato real da API.

Não inventar campos persistidos que não existam no backend.

---

## 26. POST /tasks

Exemplo conceitual de cadastro:

```json
{
  "title": "Estudar Trigonometria",
  "description": "Revisar ângulos notáveis",
  "importance": 9,
  "domain": 3,
  "urgency": 8,
  "relevance": 9,
  "resources": [
    {
      "title": "Aula de Trigonometria",
      "type": "YOUTUBE",
      "url": "https://youtube.com/...",
      "description": "Aula de revisão"
    }
  ]
}
```

Os campos abaixo são usados apenas para o cálculo inicial do score:

```text
importance
domain
urgency
relevance
```

Eles não precisam ser tratados como propriedades persistidas da Task depois da criação.

---

## 27. Regras importantes para implementação

Não adicionar sem solicitação:

- dashboard complexo;
- calendário;
- agenda semanal;
- timer obrigatório;
- status de task;
- deadline;
- duração estimada;
- autenticação;
- gamificação;
- gráficos;
- IA.

Priorizar:

- simplicidade;
- ranking;
- score;
- cards brancos;
- identidade verde;
- boa tipografia;
- espaçamento;
- resources;
- ações claras.

---

## 28. Direção visual resumida

Visual esperado:

```text
sidebar branca
+
verde como identidade principal
+
background geral muito claro
+
cards brancos
+
muito espaço em branco
+
cores do score apenas como indicadores
+
bordas discretas
+
sombras leves
+
cantos arredondados
+
interface moderna e minimalista
```

Evitar:

```text
gradientes exagerados
neon
cards excessivamente coloridos
muitos gráficos
muitos widgets
interface pesada
```

---

## 29. Exemplo conceitual da Home

```text
┌───────────────┬────────────────────────────────────────────────────┐
│ ORDo          │                                                    │
│               │ Prioridades                                        │
│ ▣ Prioridades │ Veja o que merece mais atenção agora.              │
│ ＋ Nova tarefa│                                                    │
│ ▤ Recursos    │ ┌────────────────────────────────────────────────┐ │
│ ⚙ Config.     │ │ 🔴 86  Estudar Trigonometria                  │ │
│               │ │        Revisar ângulos notáveis                │ │
│               │ │        3 recursos                             │ │
│               │ │                                                │ │
│               │ │ [Abrir] [Produtividade] [Aumentar]        ⋯   │ │
│               │ └────────────────────────────────────────────────┘ │
│               │                                                    │
│               │ ┌────────────────────────────────────────────────┐ │
│               │ │ 🟠 73  Estudar Genética                       │ │
│               │ │        2 recursos                             │ │
│               │ └────────────────────────────────────────────────┘ │
└───────────────┴────────────────────────────────────────────────────┘
```

---

## 30. Resultado esperado

O frontend deve transmitir a sensação de que:

> existe muita coisa para fazer, mas o sistema deixa claro o que merece atenção primeiro.

Fluxo central:

```text
abrir a aplicação
→ olhar o ranking
→ escolher uma task
→ executar
→ registrar produtividade
→ ver o ranking se reorganizar
```

Esse é o núcleo do produto.
