from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.ASRData import ASRData
from src.metrics import calculate_csr_metrics

router = APIRouter()

class MetricsRequest(BaseModel):
    model_output: str | dict
    reference_data: str | dict


@router.post("/calculate")
def calculate(payload: MetricsRequest):
    try:
        if isinstance(payload.model_output, dict):
            model_input = ASRData.model_validate(payload.model_output)
        else:
            model_input = payload.model_output
        if isinstance(payload.reference_data, dict):
            ref_input = ASRData.model_validate(payload.reference_data)
        else:
            ref_input = payload.reference_data
        metrics_results = calculate_csr_metrics(model_output=model_input, reference_data=ref_input)
        return metrics_results.model_dump()

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")