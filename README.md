
# Study Planner

## Executar com Docker

Com o Docker Desktop em execucao, suba frontend, API, PostgreSQL e as migracoes com:

```bash
docker compose up --build
```

Depois, acesse http://localhost:3333. A API fica disponivel em http://localhost:3000 e o PostgreSQL em `localhost:5432`.

Os dados do banco ficam no volume `postgres-data`. Para remover tambem os dados locais:

```bash
docker compose down -v
```

Para habilitar upload de PDF, preencha `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` no arquivo `.env`. Sem essas credenciais, o restante da aplicacao continua funcional.
