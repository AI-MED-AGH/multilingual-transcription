from typing import Any
from fastmlapi import MLController, route
from fastapi import UploadFile, File, Form, HTTPException, BackgroundTasks
from pydantic import BaseModel

from backend.common.jobs_data import get_jobs_data, JobData
from src.helpers import load_audio_from_bytes
from src.babel import BabelPipeline
from src.ASRData import ASRData


class StartJobResponse(BaseModel):
    job_id: int


class BabelModelController(MLController):
    model_name = "babel-multilingual-asr"
    model_version = "1.0.0"

    def __init__(self):
        super().__init__()
        self.jobs_data = get_jobs_data()
        self.next_job_id = 1

    def load_model(self) -> Any:
        return BabelPipeline(merge_segments=True)

    def _process_audio_async(self, job_data: JobData, file_bytes: bytes, speakers: str | None):
        try:
            audio = load_audio_from_bytes(file_bytes, sample_rate=16000)
            speaker_list = [s.strip() for s in speakers.split(",")] if speakers else None

            asr_data: ASRData = self.model(audio, speakers=speaker_list)

            job_data.status = "completed"
            job_data.result = str(asr_data)

        except Exception as e:
            import logging
            logging.getLogger(__name__).exception("Inference ASR Error")
            job_data.status = "failed"
            job_data.error = f"Error: {str(e)}"

    @route("/audio", methods=["POST"], tags=["Prediction"], summary="Predict using Babel ASR via Multipart")
    def predict_audio_file(
        self,
        file: UploadFile = File(...),
        speakers: str = Form(None),
        background_tasks: BackgroundTasks = BackgroundTasks()
    ):
        job_data = JobData()
        this_job_id = self.next_job_id
        self.jobs_data[this_job_id] = job_data

        self.next_job_id += 1

        try:
            file_bytes = file.file.read()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read upload file: {str(e)}")

        background_tasks.add_task(
            self._process_audio_async,
            job_data,
            file_bytes,
            speakers
        )

        response = StartJobResponse(job_id=this_job_id)
        return response.model_dump()
