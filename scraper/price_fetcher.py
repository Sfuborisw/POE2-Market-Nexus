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

        items_list = data.get("items", [])
        price_lines = {line.get("detailsId"): line for line in data.get("lines", [])}

        for item_info in items_list:
            item_id = item_info.get("id")  # e.g., "divine"

            # Check if this item exists in our tracking list (DB)
            db_item = db.query(Item).filter(Item.id == item_id).first()

            if db_item:
                # 🌟 Metadata update logic removed! Now it ONLY focuses on prices.

                # Get the bridging ID to find the price
                details_id = item_info.get("detailsId")
                price_data = price_lines.get(details_id)

                if price_data:
                    new_price = PriceHistory(
                        item_id=db_item.id,
                        price_value=price_data.get("chaosEquivalent"),
                        denominated_currency_id="divine",
                        trade_count=price_data.get("count", 0),
                        timestamp=datetime.utcnow(),
                    )
                    db.add(new_price)
                    print(
                        f"✅ Price updated: {item_id} -> {price_data.get('chaosEquivalent')} chaos eq."
                    )

        db.commit()
        print(f"✨ Price synchronization complete!")

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    fetch_and_sync()
