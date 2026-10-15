# CaseMeld

CaseMeld is a complaint-intelligence workspace that turns unstructured customer messages into categorized, prioritized, and connected cases.

## What works now

- Complaint classification across billing, fraud, access, credit reporting, product, and support issues
- Priority, sentiment, response-time, keyword, and ownership recommendations
- Similar-case matching against the working case library
- Searchable case management with status updates and detail views
- Browser-local persistence, so the complete demo runs without external credentials
- Responsive interface and social sharing metadata

## Run the product

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify a change

```bash
cd frontend
npm run lint
npm run build
```

## Optional retrieval service

The Rails app in `backend/` provides semantic complaint retrieval through Pinecone. It uses Pinecone's hosted `llama-text-embed-v2` model, so no OpenAI account or key is required. Copy `backend/.env.example` to `backend/.env`, provide the Pinecone values, install the bundle, and run Rails on port 3001.

Create the integrated-embedding index and load the complaint records by following `rag/README.md` before starting the API.

The frontend intentionally uses its built-in deterministic analysis by default. This keeps local development fast and makes the product useful before external services are configured.
