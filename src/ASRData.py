import re
from pathlib import Path
from typing import Self

from pydantic import BaseModel

class ASRSegment(BaseModel):
    start: float
    end: float
    speaker: str
    text: str

    def __str__(self) -> str:
        txt = f"[{self.start:.2f} - {self.end:.2f}] {self.speaker}: {self.text}"
        return txt


class ASRData(BaseModel):
    segments: list[ASRSegment]

    @classmethod
    def from_text(cls, txt: str) -> Self:
        """
        Converts text into ASRData (list of segments), extracting speaker and segment start/end times (in seconds)

        Expected format:

        [<START> - <END>] <SPEAKER>: <TEXT>
        [<START> - <END>] <SPEAKER>: <TEXT>

        Example:

        [0.03 - 1.79] SPEAKER_1: Hello there!
        [2.05 - 2.89] SPEAKER_2: Oh, hi! Nice to meet you!

        :return: instance of ASRData class, containing ASR segments
        """

        segments: list[ASRSegment] = []

        # Regex to capture start time, end time, speaker, and the spoken text
        pattern = re.compile(r"^\[\s*([\d\.]+)\s*-\s*([\d\.]+)\s*\]\s*([^:]+):\s*(.*)$")

        for line in txt.strip().splitlines():
            line = line.strip()
            if not line:
                continue

            match = pattern.match(line)
            if match:
                # Constructing a dictionary for the segment.
                # If you have a specific Segment dataclass/object, instantiate it here instead.
                segment = ASRSegment(
                    start=float(match.group(1)),
                    end=float(match.group(2)),
                    speaker=match.group(3).strip(),
                    text=match.group(4).strip()
                )
                segments.append(segment)
            else:
                # You can change this to a `continue` or log a warning if you
                # want it to silently skip malformed lines instead of crashing.
                raise ValueError(f"Line does not match expected ASR format: '{line}'")

        return cls(segments=segments)

    @classmethod
    def from_txt_file(cls, file_path: str | Path) -> Self:
        """
        Reads the file under provided `file_path` and extracts segments from it.
        The file format must be compatible with the one described in the `from_text` method.

        :return: instance of ASRData class, containing ASR segments
        """

        with open(file_path, "r") as f:
            txt = f.read()

        return cls.from_text(txt)

    def __str__(self):
        txt = "\n".join([str(segment) for segment in self.segments])
        return txt

    def extract_text(self) -> str:
        txt = "\n".join([segment.text for segment in self.segments])
        return txt
