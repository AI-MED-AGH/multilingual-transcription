from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv()

class Config(BaseSettings):
    APP_NAME: str = "ASR Babel"
    DEBUG: bool = False
    API_PORT: int = None

config= Config()