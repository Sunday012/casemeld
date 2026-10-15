# CaseMeld complaint ingestion

This directory prepares the public complaint dataset and loads it into a Pinecone index that uses integrated embeddings.

## Pinecone index

Create an index with these settings:

- Model: `llama-text-embed-v2`
- Dimension: `1024`
- Metric: `cosine`
- Field map: `text`
- Capacity: On-demand

## Run the importer

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export PINECONE_API_KEY="your-key"
export PINECONE_HOST="https://your-index-host.svc.pinecone.io"
export PINECONE_NAMESPACE="complaints"
python create_embeddings.py
```

On Windows PowerShell, activate the environment with `venv\Scripts\Activate.ps1` and set variables with `$env:NAME="value"`.

The importer sends batches of raw complaint text to Pinecone. Pinecone creates the embeddings with `llama-text-embed-v2`; no OpenAI key is required. Record IDs are deterministic, so rerunning the importer updates the same records instead of creating duplicates.
