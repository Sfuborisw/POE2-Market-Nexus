from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
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
    price_value: Optional[float] = None
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
def get_all_prices(item_id: Optional[str] = None, db: Session = Depends(get_db)):
    # Base query explicitly joining PriceHistory and Item
    query = db.query(PriceHistory, Item).join(Item, PriceHistory.item_id == Item.id)

    # If the frontend requests a specific item, filter it like a CSV filter
    if item_id:
        query = query.filter(PriceHistory.item_id == item_id)

    results = query.order_by(PriceHistory.timestamp.desc()).limit(500).all()

    results = results[::-1]

    return [
        {
            "id": price.id,
            "item_name": item.name if item.name else f"Unknown (ID: {item.id})",
            "price_value": price.price_value,
            "timestamp": price.timestamp,
        }
        for price, item in results
    ]


@app.get("/latest-prices")
def get_latest_prices(db: Session = Depends(get_db)):
    """
    Fetch the most recent price for every tracked currency.
    Used by the Arbitrage Calculator for real-time auto-filling.
    """
    # Fetch the last 200 records (enough to cover all currencies in the latest scraping batch)
    recent_prices = (
        db.query(PriceHistory).order_by(PriceHistory.timestamp.desc()).limit(200).all()
    )

    prices_dict = {}
    for p in recent_prices:
        # Since it's ordered by newest first, the first time we see an item_id, it's the latest price
        if p.item_id not in prices_dict:
            prices_dict[p.item_id] = p.price_value

    return prices_dict
