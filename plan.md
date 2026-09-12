# ORDo — Plan

## 1. Objetivo

ORDo é uma aplicação pessoal para organizar estudos, tarefas escolares, atividades da ETEC, simulados e outras obrigações.

O objetivo principal é evitar a indecisão sobre o que fazer, mantendo todas as tarefas ordenadas por prioridade através de um score de 0 a 100.

A aplicação não utiliza uma grade fixa de horários. O usuário decide, no momento, quanto tempo pode dedicar a uma tarefa.

---

## 2. Conceito principal

Cada tarefa possui um `score` entre 0 e 100.

Quanto maior o score, maior a prioridade da tarefa.

### Faixas de prioridade

| Score | Cor | Significado |
|---|---|---|
| 0–19 | Azul | Tranquilo |
| 20–39 | Verde | Baixa prioridade |
| 40–59 | Amarelo | Atenção |
| 60–79 | Laranja | Alta prioridade |
| 80–100 | Vermelho | Urgente |

A listagem principal sempre deve ordenar as tarefas do maior score para o menor.

---

## 3. Cálculo inicial do score

Ao criar uma tarefa, o usuário informa temporariamente quatro critérios com valores de 1 a 10:

1. Importância
2. Domínio do assunto
3. Urgência
4. Relevância para a prova

Esses valores são usados apenas para calcular o score inicial.

Eles não precisam ser persistidos no banco de dados.

### Observação sobre domínio

O domínio funciona de forma inversa:

- domínio baixo → aumenta a prioridade;
- domínio alto → diminui a prioridade.

Os pesos de cada critério serão definidos na regra de negócio.

O resultado final deve ser normalizado para uma escala de 0 a 100.

Após o cálculo, apenas o `score` resultante é salvo na tarefa.

---

## 4. Produtividade

Após estudar ou executar uma tarefa, o usuário pode registrar uma porcentagem de produtividade.

Essa porcentagem reduz diretamente o score atual.

### Fórmula

```text
novoScore = scoreAtual × (1 - produtividade / 100)
```

### Exemplo

```text
Score atual: 86
Produtividade: 55%

86 × (1 - 0,55) = 38,7

Novo score: 39
```

O score deve permanecer entre 0 e 100.

---

## 5. Aumento manual de prioridade

O score não aumenta automaticamente com o tempo.

Quando o usuário perceber que uma tarefa precisa voltar a receber atenção, ele pode aplicar um aumento percentual manual.

### Fórmula

```text
novoScore = scoreAtual × (1 + aumento / 100)
```

### Exemplo

```text
Score atual: 39
Aumento: 50%

39 × 1,50 = 58,5

Novo score: 59
```

O valor máximo permitido é 100.

O usuário não edita o score diretamente. Ele altera o score através de produtividade ou aumento de prioridade.

---

## 6. Tarefas

Todos os itens da aplicação são tratados como tarefas.

Não haverá um campo específico para diferenciar:

- estudo;
- revisão;
- simulado;
- trabalho;
- atividade da escola;
- atividade da ETEC;
- projeto.

Essa informação pode ser colocada livremente no título.

### Exemplos

```text
Estudar Trigonometria
Revisar Genética
Simulado Fatec
Trabalho de História
Tarefa ETEC — Banco de Dados
```

### Estrutura inicial

```text
tasks
├── id
├── title
├── description?
├── score
├── created_at
└── updated_at
```

Não haverá:

- status;
- prazo;
- duração cadastrada.

Quando uma tarefa não for mais necessária, ela poderá ser excluída.

---

## 7. Tempo

A duração não é cadastrada junto com a tarefa.

O usuário decide quanto tempo dedicar no momento em que vai executar a atividade.

Exemplo:

```text
Hoje tenho 20 minutos.
→ estudo 20 minutos de Trigonometria.

Outro dia tenho 1 hora.
→ posso estudar 1 hora da mesma tarefa.
```

A aplicação não deve impor uma grade de horários fixa.

---

## 8. Recursos

Cada tarefa pode possuir zero ou vários recursos.

A relação será:

```text
1 Task → N Resources
```

Os recursos são opcionais.

### Tipos de recurso

Exemplos:

- vídeo do YouTube;
- livro;
- PDF;
- site;
- lista de exercícios;
- outro material.

### Exemplos

```text
Tarefa:
Estudar Trigonometria

Recursos:
- YouTube — Aula de ângulos notáveis
- Livro — Capítulo 8, páginas 184–193
- PDF — Resumo de trigonometria
- Site — Lista de exercícios
```

### Estrutura inicial

```text
resources
├── id
├── task_id
├── title
├── type
├── url?
└── description?
```

PDFs poderão futuramente ser enviados para um serviço externo de armazenamento, como Cloudinary, enquanto o banco guarda apenas a referência/URL.

---

## 9. Registro de produtividade

Cada aplicação de produtividade deve poder ser registrada separadamente.

### Estrutura inicial

```text
productivity
├── id
├── task_id
├── percentage
└── created_at
```

O histórico completo de alterações do score não faz parte do MVP por enquanto.

---

## 10. Tela principal

A Home será a tela de prioridades.

Ela deve exibir todas as tarefas ordenadas por score decrescente.

### Exemplo

```text
🔴 86 — Estudar Trigonometria
🔴 81 — Fazer trabalho da ETEC
🟠 73 — Estudar Genética
🟡 52 — Fazer simulado Fatec
🟢 31 — Revisar Guerra Fria
```

Cada tarefa deve permitir:

- abrir;
- registrar produtividade;
- aumentar prioridade;
- editar;
- excluir.

---

## 11. Sidebar

A aplicação terá uma sidebar lateral.

Estrutura inicial:

```text
ORDo

▣ Prioridades
＋ Nova tarefa
▤ Recursos
⚙ Configurações
```

### Prioridades

Exibe o ranking das tarefas pelo score.

### Nova tarefa

Permite criar uma tarefa e calcular seu score inicial.

### Recursos

Permite visualizar os materiais cadastrados.

### Configurações

Reservado para configurações futuras, como pesos do cálculo e preferências.

---

## 12. Fluxo principal

```text
Criar tarefa
    ↓
Informar:
- importância
- domínio
- urgência
- relevância
    ↓
Calcular score
    ↓
Salvar tarefa
    ↓
Exibir no ranking
    ↓
Usuário executa a tarefa pelo tempo que puder
    ↓
Registra produtividade
    ↓
Score diminui
    ↓
Ranking é atualizado
```

Quando necessário:

```text
Usuário considera a tarefa novamente importante
    ↓
Aplica aumento percentual
    ↓
Score aumenta
    ↓
Ranking é atualizado
```

---

## 13. Escopo do MVP

O MVP deve conter:

- criação de tarefas;
- cálculo inicial do score;
- ranking por score;
- cores baseadas na faixa do score;
- descrição opcional;
- recursos opcionais por tarefa;
- registro de produtividade;
- redução percentual do score;
- aumento percentual da prioridade;
- edição de tarefa;
- exclusão de tarefa;
- listagem de recursos;
- sidebar de navegação.

### Fora do MVP por enquanto

- status de tarefa;
- prazo;
- cronograma fixo;
- duração pré-definida;
- recuperação automática do score;
- histórico completo de alterações do score;
- inteligência artificial;
- gamificação;
- múltiplos usuários.

---

## 14. Princípio do produto

O ORDo não deve decidir como o usuário organiza cada minuto do dia.

Ele deve responder principalmente:

> Entre tudo que eu preciso fazer, o que merece mais atenção agora?

O usuário continua decidindo quanto tempo dedicar. O sistema organiza as prioridades.
