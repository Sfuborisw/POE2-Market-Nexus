import sys
import os
import requests
from datetime import datetime

# Path logic: Ensure Python can find backend
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.database import SessionLocal, Item, PriceHistory

URL = "https://poe.ninja/poe2/api/economy/exchange/current/overview?league=Fate+of+the+Vaal&type=Currency"


def fetch_and_sync():
    db = SessionLocal()
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        print(f"[{datetime.now()}] Fetching price data from Poe.ninja...")
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        data = response.json()

        lines_list = data.get("lines", [])
        success_count = 0

        for line in lines_list:
            item_id = line.get("id")  # e.g., "alch", "exalted"

            # Check if this item exists in our tracking list (DB)
            db_item = db.query(Item).filter(Item.id == item_id).first()

            if db_item:
                price_val = line.get("primaryValue")

                if price_val is not None:
                    new_price = PriceHistory(
                        item_id=db_item.id,
                        price_value=price_val,
                        denominated_currency_id="divine",
                        trade_count=int(line.get("volumePrimaryValue", 0)),
                        timestamp=datetime.utcnow(),
                    )
                    db.add(new_price)
                    success_count += 1
                    print(f"✅ Price updated: {item_id} -> {price_val} Divine")

        db.commit()
        print(f"✨ Price synchronization complete! Updated {success_count} records.")

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    fetch_and_sync()
