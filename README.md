# 📚 Study Planner

Aplicação web para organizar estudos e tarefas por prioridade. Cada tarefa recebe um score de `0` a `100`, permitindo visualizar rapidamente o que merece atenção.

## ✨ Funcionalidades

- 👤 Cadastro de usuários com senha protegida por hash
- 🔐 Login com JWT, sessão em cookie `HttpOnly` e logout
- 🛡️ Rotas protegidas e dados isolados por usuário
- ✅ Criar, editar e excluir tarefas
- 📊 Ranking por score decrescente
- 🧮 Cálculo de prioridade por importância, domínio, urgência e relevância
- 📉 Registro de produtividade
- 📈 Aumento manual de prioridade
- 🔗 Recursos por tarefa: vídeos, livros, sites e PDFs
- ☁️ Upload de PDFs para o Cloudinary
- 🧪 Testes unitários, de componentes e end-to-end

## 🛠️ Tecnologias

| Área | Tecnologias |
| --- | --- |
| Frontend | ![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB) ![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white) ![TanStack Query](https://img.shields.io/badge/TanStack_Query_5-FF4154?logo=reactquery&logoColor=white) |
| Backend | ![Node.js](https://img.shields.io/badge/Node.js_24-339933?logo=nodedotjs&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS_12-E0234E?logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) |
| Banco | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-4169E1?logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?logo=prisma&logoColor=white) |
| Validação | ![Zod](https://img.shields.io/badge/Zod_4-3E67B1?logo=zod&logoColor=white) |
| Testes | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?logo=testinglibrary&logoColor=white) ![Supertest](https://img.shields.io/badge/Supertest-333333) |
| Infraestrutura | ![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white) |

## 🧱 Arquitetura

```text
study-planner/
├── src/                  # API NestJS
│   ├── auth/             # JWT, guard global e usuário autenticado
│   ├── users/            # cadastro e persistência de usuários
│   ├── sessions/         # login e emissão de access token
│   ├── tasks/            # tarefas, score e produtividade
│   ├── resources/        # recursos e upload de PDF
│   ├── database/         # Prisma e PostgreSQL
│   └── storage/          # abstração de armazenamento
├── prisma/               # schema e migrations
└── web/                  # frontend Next.js
    └── src/
        ├── app/          # páginas e layouts
        ├── components/   # componentes da interface
        └── lib/          # API client e regras de domínio
```

O frontend acessa `/api/*`. O Next.js encaminha essas requisições para a API por rewrite, mantendo o navegador na mesma origem e evitando a necessidade de CORS. O proxy do Next.js lê a sessão armazenada em cookie e adiciona o header `Authorization: Bearer <token>` às chamadas protegidas.

## 🚀 Instalação local

### Pré-requisitos

- Node.js 24+
- pnpm
- Docker Desktop
- Conta Cloudinary (somente para upload de PDFs)

### 1. Dependências

```bash
corepack enable
pnpm install
cd web && pnpm install && cd ..
```

### 2. Ambiente

```bash
cp .env.example .env        # macOS/Linux
Copy-Item .env.example .env # PowerShell
```

Configure o `.env`:

```env
DATABASE_URL="postgresql://study_planner:study_planner@localhost:5432/study_planner"
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
JWT_SECRET="use-um-segredo-longo-e-aleatorio"
JWT_EXPIRES_IN="1d"
```

`JWT_SECRET` assina e valida os tokens. `JWT_EXPIRES_IN` define sua validade e aceita valores reconhecidos pelo JWT, como `1h` ou `1d`.

Opcionalmente, defina `ORDO_API_ORIGIN` no ambiente do frontend quando a API não estiver em `http://localhost:3000`.

### 3. Banco de dados

```bash
docker compose up -d postgres
pnpm exec prisma generate
pnpm exec prisma migrate deploy
```

### 4. Executar

Terminal 1 — API:

```bash
pnpm start:dev
```

Terminal 2 — frontend:

```bash
cd web
pnpm dev
```

Acesse **http://localhost:3333**. A API fica disponível em **http://localhost:3000**.

Na primeira visita, o frontend redireciona para `/login`. Crie uma conta em `/cadastro`; ao concluir o cadastro, a aplicação também realiza o login automaticamente.

## 🐳 Executar com Docker

Para subir PostgreSQL, API e frontend:

```bash
docker compose up --build
```

O serviço da API aplica as migrations automaticamente. Para parar os containers:

```bash
docker compose down
```

## 🧠 Regras principais

### Score inicial

Os critérios variam de `1` a `10`. O domínio é invertido: quanto menor o domínio, maior a prioridade.

```text
score = (importância × 0,3
       + (10 - domínio) × 0,3
       + urgência × 0,2
       + relevância × 0,2) × 10
```

Os critérios são usados apenas na criação; somente o score é salvo.

### Produtividade e prioridade

```text
produtividade: score × (1 - percentual)
aumento:        score × (1 + percentual), limitado a 100
```

A interface trabalha com porcentagens (`60%`), enquanto a API recebe frações (`0.6`).

## 🔌 API principal

API base: `http://localhost:3000`

### Autenticação

| Método | Endpoint | Acesso | Ação |
| --- | --- | --- | --- |
| `POST` | `/users` | Público | Cadastrar usuário |
| `POST` | `/sessions` | Público | Validar credenciais e emitir JWT |

O cadastro recebe `name`, `email` e `password`. O nome é obrigatório, o e-mail deve ser válido e único, e a senha precisa ter pelo menos 8 caracteres. O login recebe `email` e `password` e retorna `{ "accessToken": "..." }`.

Todas as demais rotas exigem o token no header `Authorization: Bearer <token>`. Tarefas e recursos são filtrados pelo usuário identificado no token; um usuário não pode consultar nem alterar dados de outro.

### Tarefas e recursos

| Método | Endpoint | Ação |
| --- | --- | --- |
| `POST` | `/tasks` | Criar tarefa do usuário autenticado |
| `GET` | `/tasks/list` | Listar ranking do usuário autenticado |
| `GET` | `/tasks/:id` | Detalhar tarefa |
| `PATCH` | `/tasks/:id` | Editar tarefa |
| `DELETE` | `/tasks/:id` | Excluir tarefa |
| `POST` | `/tasks/:id/productivities` | Registrar produtividade |
| `POST` | `/tasks/:id/priority-boost` | Aumentar prioridade |
| `GET` | `/resources` | Listar recursos do usuário autenticado |
| `POST` | `/resources/pdf` | Enviar PDF para uma tarefa do usuário |

Exemplo de cadastro e login:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"senha-segura"}'

curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"senha-segura"}'
```

Exemplo de produtividade de 60%:

```bash
curl -X POST http://localhost:3000/tasks/TASK_ID/productivities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"percentage": 0.6}'
```

### Fluxo no frontend

- `/cadastro` cria a conta, autentica o usuário e inicia a sessão.
- `/login` autentica e redireciona para a página originalmente solicitada.
- O JWT fica no cookie `study_planner_session`, com `HttpOnly`, `SameSite=Lax` e `Secure` em produção.
- Usuários sem sessão são redirecionados para `/login`; usuários autenticados não acessam novamente as telas de login e cadastro.
- O botão **Sair** remove o cookie e retorna à tela de login.

## 📜 Scripts

Na raiz:

```bash
pnpm start:dev    # API em modo desenvolvimento
pnpm build        # build da API
pnpm test         # testes da API
pnpm test:e2e     # testes end-to-end
pnpm lint         # lint da API
```

No frontend (`web/`):

```bash
pnpm dev          # frontend em modo desenvolvimento
pnpm build        # build de produção
pnpm check        # typecheck, lint, testes e build
```

## 📌 Decisões técnicas

- **NestJS por módulos:** separa tarefas, recursos, banco e storage.
- **JWT com guard global:** protege a API por padrão; somente cadastro e login são públicos.
- **Senha com bcrypt:** persiste apenas o hash da senha, nunca a senha em texto puro.
- **Sessão em cookie `HttpOnly`:** impede o acesso ao token pelo JavaScript do navegador e permite ao proxy anexá-lo às chamadas para a API.
- **Dados por usuário:** operações de tarefas e recursos usam o identificador do JWT para garantir isolamento.
- **Repositories:** isolam a persistência e facilitam testes com implementações em memória.
- **Prisma + PostgreSQL:** fornecem migrations, tipagem e suporte às relações do domínio.
- **Zod:** centraliza a validação dos payloads da API.
- **Cloudinary atrás de `FileStorage`:** permite trocar o provedor sem alterar a regra de upload.
- **Score persistido:** facilita a ordenação e mantém o estado atual da prioridade.

## 📄 Licença

Projeto privado e sem licença pública (`UNLICENSED`).
