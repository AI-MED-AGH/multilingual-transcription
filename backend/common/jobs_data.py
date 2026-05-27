from typing import Literal

from pydantic import BaseModel


class JobData(BaseModel):
    status: Literal["processing", "completed", "failed"] = "processing"
    result: str = ""
    error: str | None = None


# Shared between modules
jobs_data: dict[int, JobData] = {}

def get_jobs_data() -> dict[int, JobData]:
    return jobs_data
