import sys
import os
import requests
from datetime import datetime

# Path logic: Ensure Python can find backend
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.database import SessionLocal
from backend.models import Item, PriceHistory

URL = "https://poe.ninja/poe2/api/economy/exchange/current/overview?league=Fate+of+the+Vaal&type=Currency"


def fetch_and_sync():
    db = SessionLocal()
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        print(f"[{datetime.now()}] Fetching data from Poe.ninja...")
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        data = response.json()

        # 1. Get or create Divine Orb as base currency
        divine_orb = db.query(Item).filter(Item.name == "divine").first()
        if not divine_orb:
            divine_orb = Item(name="divine", category="Currency")
            db.add(divine_orb)
            db.commit()
            db.refresh(divine_orb)

        lines = data.get("lines", [])
        print(f"Processing {len(lines)} items...")

        for line in lines:
            item_name = line.get("id")

            # 2. Sync Item metadata
            db_item = db.query(Item).filter(Item.name == item_name).first()
            if not db_item:
                db_item = Item(name=item_name, category="Currency")
                db.add(db_item)
                db.commit()
                db.refresh(db_item)

            # 3. Insert price record
            new_price = PriceHistory(
                item_id=db_item.id,
                price_value=line.get("primaryValue"),
                denominated_currency_id=divine_orb.id,
                trade_count=line.get("count", 0),
            )
            db.add(new_price)

        db.commit()
        print(f"✅ [{datetime.now()}] Successfully synced to PostgreSQL.")

    except Exception as e:
        print(f"❌ Error during sync: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    fetch_and_sync()
