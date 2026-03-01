from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import engine, Base, get_db

# Create tables in Postgres
Base.metadata.create_all(bind=engine)

app = FastAPI(title="POE2 Market Nexus API")


@app.get("/")
def read_root():
    return {"status": "POE2 Market Nexus API is running"}


@app.get("/items")
def get_items(db: Session = Depends(get_db)):
    # Placeholder for fetching items later
    return {"message": "Database connected successfully"}
