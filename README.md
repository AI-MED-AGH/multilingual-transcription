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
```

A tiny amount of tokens is ued from openai platform, so total costs should not exceed a few cents.

Download example data from [GitHub release](https://github.com/Ajver/multilingual-transcription/releases/download/data_v1/data.zip), and upack it as `data` folder in the root of this repo.
