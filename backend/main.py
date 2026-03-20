from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import SessionLocal, PriceHistory, GoldTaxRate, Item
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="POE2 Market Nexus API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PriceRecord(BaseModel):
    id: int
    item_name: str
    price_value: float
    timestamp: datetime

    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/currencies")
def get_currencies(db: Session = Depends(get_db)):
    # 1. Join the Item and GoldTaxRate tables
    results = (
        db.query(Item, GoldTaxRate)
        .join(GoldTaxRate, Item.id == GoldTaxRate.item_id)
        .all()
    )

    # 2. Format the data perfectly for the React frontend
    currencies_data = []
    for item, tax in results:
        currencies_data.append(
            {
                "id": item.id,  # e.g., "divine"
                "name": item.name,  # e.g., "Divine Orb"
                "icon_url": item.icon_url,  # e.g., "https://web.poecdn.com/..."
                "gold_cost": tax.gold_cost,  # e.g., 800
            }
        )

    return currencies_data


@app.get("/prices", response_model=List[PriceRecord])
def get_all_prices(db: Session = Depends(get_db)):
    # Use joinedload pre-load Item data for efficiency
    from sqlalchemy.orm import joinedload

    results = (
        db.query(PriceHistory)
        .options(joinedload(PriceHistory.item))
        .order_by(PriceHistory.timestamp.desc())
        .limit(100)
        .all()
    )

    return [
        {
            "id": r.id,
            "item_name": r.item.name if r.item else f"Unknown (ID: {r.item_id})",
            "price_value": r.price_value,
            "timestamp": r.timestamp,
        }
        for r in results
    ]
