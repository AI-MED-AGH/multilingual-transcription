from pathlib import Path
import io

import librosa
import torch


def load_audio_for_diarization(audio_path: str | Path, sample_rate: int | None) -> dict:
    waveform, samplerate = librosa.load(audio_path, sr=sample_rate)

    waveform = torch.from_numpy(waveform).unsqueeze(0).float()

    audio_mapping = {
        "waveform": waveform,
        "sample_rate": samplerate,
        "channel": 0,
        "uri": audio_path.name,
    }
    return audio_mapping


def load_audio_from_bytes(audio_bytes: bytes, sample_rate: int = 16000) -> dict:
    audio_stream = io.BytesIO(audio_bytes)
    data, sr = librosa.load(audio_stream, sr=sample_rate)

    waveform = torch.from_numpy(data).unsqueeze(0).float()

    audio_mapping = {
        "waveform": waveform,
        "sample_rate": sr,
        "channel": 0,
        "uri": "streaming_audio.wav",
    }
    return audio_mapping

def merge_consecutive_segments(diary_result, waveform: torch.Tensor, sample_rate: int) -> list[dict]:
    # Slicing the audio to individual speaker segments
    segments = []
    previous_speaker = None

    annotation = diary_result.speaker_diarization

    for turn, _, speaker in annotation.itertracks(yield_label=True):
        start_idx = int(turn.start * sample_rate)
        end_idx = int(turn.end * sample_rate)
        waveform_segment = waveform[0, start_idx:end_idx]

        if speaker != previous_speaker:
            # another speaker is now
            segments.append({
                "waveform": waveform_segment,
                "speaker": speaker,
                "start": turn.start,
                "end": turn.end,
            })
        else:
            # The same speaker keeps talking
            previous_segment = segments[-1]
            merged_waveforms = torch.concat([previous_segment["waveform"], waveform_segment], dim=0)
            segments[-1]["waveform"] = merged_waveforms
            segments[-1]["end"] = turn.end

        previous_speaker = speaker

    return segments


def split_waveform_by_segments(diary_result, waveform: torch.Tensor, sample_rate: int) -> list[dict]:
    # Slicing the audio to individual segments
    segments = []

    annotation = diary_result.speaker_diarization

    for turn, _, speaker in annotation.itertracks(yield_label=True):
        start_idx = int(turn.start * sample_rate)
        end_idx = int(turn.end * sample_rate)
        waveform_segment = waveform[0, start_idx:end_idx]

        segments.append({
            "waveform": waveform_segment,
            "speaker": speaker,
            "start": turn.start,
            "end": turn.end,
        })

    return segments
