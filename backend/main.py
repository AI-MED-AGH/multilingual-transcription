import uvicorn
from fastapi import FastAPI


from backend.core.config import config
from backend.core.core_logging import setup_logging
from backend.routers import metrics
from backend.model_server.run_model import BabelModelController
import warnings

warnings.filterwarnings("ignore", message=".*torchcodec is not installed correctly.*")

setup_logging()

transcription_controller = BabelModelController()
transcription_controller.initialize()
app = FastAPI(title=config.APP_NAME,
              debug=config.DEBUG)

app.include_router(metrics.router, prefix="/metrics")
app.mount("/transcription", transcription_controller.app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=config.API_PORT)
