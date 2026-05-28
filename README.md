# multilingual-transcription

## Setup

Run:

```bash
uv sync
```

Create `.env` file in the root folder of this repository, with following fields:
```.env
OPENAI_API_KEY=<your-openai-key>
HUGGINGFACE_TOKEN=<your-huggingface-key>
API_PORT=8000
API_URL=http://localhost:8000
```

A tiny amount of tokens is ued from openai platform, so total costs should not exceed a few cents.

Download example data from [GitHub release](https://github.com/Ajver/multilingual-transcription/releases/download/data_v1/data.zip), and upack it as `data` folder in the root of this repo.

## Backend server

```bash
python -m backend.main
```

### Backend endpoints:

#### `POST /metrics/calculate`

Request:
```JSON
{
  "model_output": "model output text",
  "reference_data": "reference text"
}
```

Response:
```JSON
{
    "wer": 0.23,
    "mer": 0.21,
    "wder": 0.56
}
```

#### `POST /transcription/audio`:

Request:
```
Multipart form data with: 
  - `file` field containing audio file
  - optional: `speakers` field containing comma separated speaker names.
```

Response:
```JSON
{
    "job_id": 1
}
```

#### `GET /job/{id}`

Pass `job_id` got from `/transcription/audio` response as part of the request URL.

Response:
```JSON
{
    "status": "processing"|"completed"|"failed",
    "result": "<model output only when status=completed>",
    "error": "<error or null>" | null
}
```

or 404, when job not found.

#### `DELETE /job/{id}`

Pass `job_id` got from `/transcription/audio` response as part of the request URL.

Response:
```JSON
{
    "status": "success"
}
```

or 404, when job not found.
