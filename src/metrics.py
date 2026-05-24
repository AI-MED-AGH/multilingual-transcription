import re

import jiwer
from pydantic import BaseModel

from src.ASRData import ASRData


class CSRMetrics(BaseModel):
    wer: float
    mer: float
    wder: float

    def __str__(self) -> str:
        to_return = f"""
================================
         CSR results
--------------------------------
 WER (Word Error Rate):    {self.wer:.2f}
 MER (Match Error Rate):   {self.mer:.2f}
 WDER (Diarization Error): {self.wder:.2f}
================================
"""
        return to_return


def normalize_text(text: str) -> str:
    text = text.lower()
    text = text.replace("\n", " ")
    text = re.sub(r"[^\w\s]", "", text) # Remove punctuation
    return text


def calculate_csr_metrics(model_output: str | ASRData, reference_data: str | ASRData) -> CSRMetrics:
    if isinstance(model_output, str):
        hypothesis_text = model_output
    else:
        hypothesis_text = model_output.extract_text()

    if isinstance(reference_data, str):
        reference_text = reference_data
    else:
        reference_text = reference_data.extract_text()

    hypothesis_text = normalize_text(hypothesis_text)
    reference_text = normalize_text(reference_text)

    wer = jiwer.wer(reference_text, hypothesis_text)
    mer = jiwer.mer(reference_text, hypothesis_text)

    if isinstance(model_output, str) or isinstance(reference_data, str):
        # Can't calculate diarization error without diarization data
        wder = -1.0
    else:
        model_output: ASRData = model_output
        correct_speaker = 0
        total_words = 0

        for h_seg in model_output.segments:
            words = h_seg.text.split()
            total_words += len(words)

            for r_seg in reference_data.segments:
                if h_seg.start < r_seg.end and h_seg.end > r_seg.start:
                    if h_seg.speaker == r_seg.speaker:
                        correct_speaker += len(words)
                    break

        wder = 1 - (correct_speaker / total_words) if total_words > 0 else 0

    csr_metrics = CSRMetrics(
        wer=wer,
        mer=mer,
        wder=wder
    )

    return csr_metrics
