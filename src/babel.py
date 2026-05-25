import os
import warnings
from pathlib import Path

from dotenv import load_dotenv
from faster_whisper import WhisperModel
from pyannote.audio import Pipeline

from src.ASRData import ASRData, ASRSegment
from src.helpers import load_audio_for_diarization, split_waveform_by_segments, merge_consecutive_segments

load_dotenv()


class BabelPipeline:
    def __init__(self, merge_segments: bool) -> None:
        self.SAMPLE_RATE = 16000

        self.merge_segments = merge_segments

        self.whisper = WhisperModel("small", use_auth_token=os.environ["HUGGINGFACE_TOKEN"])
        self.diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1", token=os.environ["HUGGINGFACE_TOKEN"])

    def __call__(self, audio: str|Path|dict, speakers: list[str]|None = None) -> ASRData:
        if isinstance(audio, dict):
            audio = audio
        else:
            audio = load_audio_for_diarization(audio, self.SAMPLE_RATE)

        with warnings.catch_warnings(action="ignore"):
            diary = self.diarization_pipeline(audio)

        if self.merge_segments:
            segments = merge_consecutive_segments(diary, audio["waveform"], self.SAMPLE_RATE)
        else:
            segments = split_waveform_by_segments(diary, audio["waveform"], self.SAMPLE_RATE)

        asr_segments: list[ASRSegment] = []

        for segment in segments:
            transcription_segments, info = self.whisper.transcribe(segment["waveform"].numpy(), beam_size=5)
            segments = list(segments)
            transcription = ""
            for tr_segment in list(transcription_segments):
                text = tr_segment.text.strip()
                transcription += text + " "

            asr_segment = ASRSegment(
                start=segment["start"],
                end=segment["end"],
                speaker=segment["speaker"],
                text=transcription,
            )
            asr_segments.append(asr_segment)

        asr_data = ASRData(segments=asr_segments)

        if speakers:
            asr_data.override_speakers(speakers)

        return asr_data
