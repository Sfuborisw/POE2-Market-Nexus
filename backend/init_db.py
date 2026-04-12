# init_db.py
from backend.database import engine, Base, Item, PriceHistory, GoldTaxRate

print("Creating all database tables (Items, PriceHistory, GoldTaxRate)...")

# This line creates tables based on the Classes imported above
Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully!")
