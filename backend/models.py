from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String)  # e.g., "Currency", "Waystone"
    icon_url = Column(String, nullable=True)


class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    price_chaos = Column(Float)
    price_divine = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class GoldTax(Base):
    __tablename__ = "gold_tax_rates"

    id = Column(Integer, primary_key=True, index=True)
    item_tier = Column(Integer)
    gold_cost = Column(Integer)
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
