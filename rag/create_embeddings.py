"""Load cleaned complaint records into a Pinecone integrated-embedding index."""

import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from dotenv import load_dotenv


API_VERSION = "2025-10"
BATCH_SIZE = 96
DATA_FILE = Path(__file__).with_name("cleaned_data.json")


def required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def normalize_host(host: str) -> str:
    value = host.rstrip("/")
    if value.startswith(("http://", "https://")):
        return value
    return f"https://{value}"


def build_record(complaint: dict, position: int) -> dict | None:
    text = str(complaint.get("complaint_what_happened") or "").strip()
    if not text:
        return None

    return {
        "_id": f"complaint-{position:07d}",
        "text": text,
        "product": complaint.get("product") or "",
        "issue": complaint.get("issue") or "",
        "sub_issue": complaint.get("sub_issue") or "",
        "tags": complaint.get("tags") or "",
    }


def upsert_batch(url: str, api_key: str, records: list[dict]) -> None:
    body = ("\n".join(json.dumps(record, separators=(",", ":")) for record in records) + "\n").encode()
    request = Request(
        url,
        data=body,
        method="POST",
        headers={
            "Accept": "application/json",
            "Api-Key": api_key,
            "Content-Type": "application/x-ndjson",
            "X-Pinecone-Api-Version": API_VERSION,
        },
    )

    try:
        with urlopen(request, timeout=90) as response:
            if response.status >= 300:
                raise RuntimeError(f"Pinecone upsert failed with status {response.status}")
    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Pinecone upsert failed with status {error.code}: {details}") from error
    except URLError as error:
        raise RuntimeError(f"Could not connect to Pinecone: {error.reason}") from error


def main() -> None:
    load_dotenv()
    api_key = required_env("PINECONE_API_KEY")
    host = normalize_host(required_env("PINECONE_HOST"))
    namespace = os.getenv("PINECONE_NAMESPACE", "complaints").strip() or "complaints"
    url = f"{host}/records/namespaces/{quote(namespace, safe='')}/upsert"

    with DATA_FILE.open(encoding="utf-8") as source:
        complaints = json.load(source)

    records = [
        record
        for position, complaint in enumerate(complaints, start=1)
        if (record := build_record(complaint, position)) is not None
    ]

    for offset in range(0, len(records), BATCH_SIZE):
        batch = records[offset : offset + BATCH_SIZE]
        upsert_batch(url, api_key, batch)
        print(f"Uploaded {min(offset + len(batch), len(records))}/{len(records)} records")

    print(f"Finished loading {len(records)} complaints into namespace '{namespace}'.")


if __name__ == "__main__":
    main()
