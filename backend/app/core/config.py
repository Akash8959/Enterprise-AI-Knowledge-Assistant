from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    APP_NAME: str = os.getenv("APP_NAME")
    APP_VERSION: str = os.getenv("APP_VERSION")
    DEBUG: bool = os.getenv("DEBUG") == "True"
    API_V1_STR: str = os.getenv("API_V1_STR")
    DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()