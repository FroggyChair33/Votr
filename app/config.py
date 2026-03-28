from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://stephen1:stephen0902@localhost:3301/Votr")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-to-a-long-random-secret-key-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
OPEN_FEC_API_KEY = os.getenv("OPEN_FEC_API_KEY", "80ADGR1jKlv3l80uqdSUTrAUFEdC5T2woUYoiIgC")
