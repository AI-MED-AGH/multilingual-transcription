from typing import Any
from fastmlapi import MLController, route
from fastapi import UploadFile, File, Form, HTTPException
from src.helpers import load_audio_from_bytes
from src.babel import BabelPipeline
from src.ASRData import ASRData


class BabelModelController(MLController):
    model_name = "babel-multilingual-asr"
    model_version = "1.0.0"

    def load_model(self) -> Any:
        return BabelPipeline(merge_segments=True)

    @route("/audio", methods=["POST"], tags=["Prediction"], summary="Predict using Babel ASR via Multipart")
    def predict_audio_file(self, file: UploadFile = File(...), speakers: str = Form(None)):

        try:
            file_bytes = file.file.read()
            audio = load_audio_from_bytes(file_bytes, sample_rate=16000)
            speaker_list = [s.strip() for s in speakers.split(",")] if speakers else None
            asr_data: ASRData = self.model(audio, speakers=speaker_list)

            return asr_data.model_dump()

        except Exception as e:
            import logging
            logging.getLogger(__name__).exception("Błąd podczas inferencji ASR")
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")