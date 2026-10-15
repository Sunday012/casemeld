# CaseMeld retrieval API

This Rails API finds complaints related to a submitted customer message. Pinecone performs both embedding and semantic search with its hosted `llama-text-embed-v2` model.

## Configuration

Copy `.env.example` to `.env` and set:

```text
PINECONE_API_KEY=your-key
PINECONE_HOST=https://your-index-host.svc.pinecone.io
PINECONE_NAMESPACE=complaints
FRONTEND_ORIGIN=http://localhost:3000
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

Deploy the `backend` working directory with internal port `3001`. Set `RAILS_ENV=production`, `PINECONE_API_KEY`, `PINECONE_HOST`, `PINECONE_NAMESPACE`, `FRONTEND_ORIGIN`, and a generated `SECRET_KEY_BASE` in the hosting environment.
