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
        # to_return += "=" * 30
        # to_return += "\n" + "         CSR results"
        # to_return += "\n" + "=" * 30
        # to_return += "\n" + f"WER (Word Error Rate):    {self.wer:.2f}"
        # to_return += "\n" + f"MER (Match Error Rate):   {self.mer:.2f}"
        # to_return += "\n" + f"WDER (Diarization Error): {self.wder:.2f}"
        # to_return += "\n" + "-" * 30
        return to_return


def calculate_csr_metrics(model_output: str | ASRData, reference_data: str | ASRData) -> CSRMetrics:
    if isinstance(model_output, str):
        hypothesis_text = model_output.lower()
    else:
        hypothesis_text = model_output.extract_text().lower()

    if isinstance(reference_data, str):
        reference_text = reference_data.lower()
    else:
        reference_text = reference_data.extract_text().lower()

    wer = jiwer.wer(reference_text, hypothesis_text)
    mer = jiwer.mer(reference_text, hypothesis_text)

    if isinstance(model_output, str) or isinstance(reference_data, str):
        # Can't calculate diarization error without diarization data
        wder = -1.0
    else:
        correct_speaker = 0
        total_words = 0

        for h_seg in model_output:
            words = h_seg['text'].split()
            total_words += len(words)

            for r_seg in reference_data:
                if h_seg['start'] < r_seg['end'] and h_seg['end'] > r_seg['start']:
                    if h_seg['speaker'] == r_seg['speaker']:
                        correct_speaker += len(words)
                    break

        wder = 1 - (correct_speaker / total_words) if total_words > 0 else 0

    csr_metrics = CSRMetrics(
        wer=wer,
        mer=mer,
        wder=wder
    )

    return csr_metrics
