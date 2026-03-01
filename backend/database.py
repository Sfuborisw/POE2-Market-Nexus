import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Locate the .env file in the root directory
# __file__ is backend/database.py, .parent is backend/, and the next .parent is Root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

# Add check to prevent crash if URL is None
if DATABASE_URL is None:
    print(f"Error: .env file not found at {env_path} or DATABASE_URL is missing!")
else:
    print("Database URL loaded successfully.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
