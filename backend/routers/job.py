from fastapi import APIRouter, Depends, HTTPException

from backend.common.jobs_data import get_jobs_data, JobData

router = APIRouter()


@router.get("/job/{id}")
def get_job_status(id: int, jobs: dict[int, JobData] = Depends(get_jobs_data)):
    if id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job_data: JobData = jobs[id]
    return job_data.model_dump()


@router.delete("/job/{id}")
def get_job_status(id: int, jobs: dict[int, JobData] = Depends(get_jobs_data)):
    if id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    del jobs[id]
    return {"status": "success"}
