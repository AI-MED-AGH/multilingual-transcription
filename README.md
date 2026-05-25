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
```

A tiny amount of tokens is ued from openai platform, so total costs should not exceed a few cents.

Download example data from [GitHub release](https://github.com/Ajver/multilingual-transcription/releases/download/data_v1/data.zip), and upack it as `data` folder in the root of this repo.

## Backend server

```bash
python -m backend.main
```

There are two endpoints:
- `POST :8000/metrics/calculate`:
{
  "model_output": "model output text",
  "reference_data": "reference text"
}
- `POST :8000/transcription/audio`:
Multipart form data with: 
  - `file` field containing audio file
  - `speakers` field containing comma separated speakers.