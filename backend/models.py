from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

try:
    from backend.database import Base
except ImportError:
    from database import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # e.g., "Mirror of Kalandra"
    category = Column(String)  # e.g., "Currency"
    icon_url = Column(String, nullable=True)  #

    # Relationships
    prices = relationship(
        "PriceHistory", foreign_keys="PriceHistory.item_id", back_populates="item"
    )
    gold_tax = relationship("GoldTax", back_populates="item", uselist=False)


class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))

    # Change: Universal pricing
    price_value = Column(Float)  # Value (e.g., 1.5)
    denominated_currency_id = Column(
        Integer, ForeignKey("items.id")
    )  # Points to the Item used as currency (e.g., ID of Divine)

    trade_count = Column(Integer)  # Corresponds to count in JSON
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  #

    item = relationship("Item", foreign_keys=[item_id], back_populates="prices")
    currency = relationship("Item", foreign_keys=[denominated_currency_id])


class GoldTax(Base):
    __tablename__ = "gold_tax_rates"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    gold_cost = Column(Integer)

    item = relationship("Item", back_populates="gold_tax")
