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
        print(f"[{datetime.now()}] Fetching data from Poe.ninja...")
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        data = response.json()

        # 🌟 Fixed Path: Get items and lines directly from Root
        items_list = data.get("items", [])
        price_lines = {line.get("detailsId"): line for line in data.get("lines", [])}

        print(f"Processing basic data for {len(items_list)} currency items...")

        for item_info in items_list:
            item_id = item_info.get("id")  # This is "divine", used as DB Primary Key

            db_item = db.query(Item).filter(Item.id == item_id).first()

            if db_item:
                # 1. Update Metadata (Only update name and add Prefix to image URL)
                db_item.name = item_info.get("name")

                raw_img = item_info.get("image")
                if raw_img:
                    db_item.icon_url = (
                        f"https://web.poecdn.com/{raw_img}"  # Added Domain for you
                    )

                # 2. Get Price (detailsId is only used for mapping in JSON, not stored in DB)
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
                    print(f"✅ Sync successful: {item_id} (Name and image completed)")

        db.commit()
        print(f"✨ Data synchronization complete!")

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    fetch_and_sync()
