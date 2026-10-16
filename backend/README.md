# CaseMeld retrieval API

This Rails API finds complaints related to a submitted customer message. Pinecone performs both embedding and semantic search with its hosted `llama-text-embed-v2` model.

## Configuration

Copy `.env.example` to `.env` and set:

```text
PINECONE_API_KEY=your-key
PINECONE_HOST=https://your-index-host.svc.pinecone.io
PINECONE_NAMESPACE=complaints
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/casemeld_production
```

The Pinecone index must use integrated embedding with a `text` field map. Follow `../rag/README.md` to create and populate it.

## Run locally

```bash
bundle install
bin/rails server -p 3001
```

Search with:

```bash
curl http://localhost:3001/api/v1/questions \
  -H 'Content-Type: application/json' \
  -d '{"question":"I was charged twice and support has not returned my money."}'
```

## Deploy

Deploy the `backend` working directory as a Docker web service. Set `RAILS_ENV=production`, `DATABASE_URL`, `PINECONE_API_KEY`, `PINECONE_HOST`, `PINECONE_NAMESPACE`, `FRONTEND_ORIGIN`, and a generated `SECRET_KEY_BASE` in the hosting environment.

On Render, create a PostgreSQL database and copy its **Internal Database URL** into the web service as `DATABASE_URL`. Set `FRONTEND_ORIGIN=https://casemeld.vercel.app`. The Docker entrypoint runs `db:prepare` during every deployment, so new migrations are applied automatically.

The case API is available at `/api/v1/complaints`. Cases saved from the frontend are stored in PostgreSQL and shared across browsers and devices.
