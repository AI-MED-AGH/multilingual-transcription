import torch


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