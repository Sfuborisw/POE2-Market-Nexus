import json
import os
import requests
from backend.database import SessionLocal, Item, GoldTaxRate
from dotenv import load_dotenv


def seed_gold_taxes():
    db = SessionLocal()

    # Define file path (ensure json is found)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, "gold_tax.json")

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        tax_rates = data.get("tax_rates", {})
        print(f"Starting processing of {len(tax_rates)} currency tax rate items...")

        for item_id, gold_fee in tax_rates.items():
            # 1. Check if Item exists, create if not (Upsert Item)
            item = db.query(Item).filter(Item.id == item_id).first()
            if not item:
                # Create a basic Item here, use ID as Name for now
                # The Scraper will automatically update details like Name and Icon later
                item = Item(
                    id=item_id,
                    name=item_id.replace("-", " ").title(),  # Format name
                    category="Currency",
                )
                db.add(item)
                db.flush()  # Get ID for next step
                print(f"🆕 Created new item: {item_id}")

            # 2. Handle GoldTaxRate (Upsert Tax)
            tax_record = (
                db.query(GoldTaxRate).filter(GoldTaxRate.item_id == item.id).first()
            )

            if tax_record:
                tax_record.gold_cost = gold_fee
                print(f"🔄 Updated tax rate: {item_id} -> {gold_fee}")
            else:
                new_tax = GoldTaxRate(item_id=item.id, gold_cost=gold_fee)
                db.add(new_tax)
                print(f"✅ Inserted new tax rate: {item_id} -> {gold_fee}")

        db.commit()
        print("\n✨ All tax rate data synchronization complete!")

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        db.rollback()
    finally:
        db.close()


def fetch_metadata_from_ninja(db):
    print("Fetching official names and icons from Poe.ninja...")

    load_dotenv()
    league = os.getenv("POE_LEAGUE", "Fate+of+the+Vaal")
    URL = f"https://poe.ninja/poe2/api/economy/exchange/current/overview?league={league}&type=Currency"

    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        data = response.json()

        items_list = data.get("items", [])

        for item_info in items_list:
            item_id = item_info.get("id")
            db_item = db.query(Item).filter(Item.id == item_id).first()

            if db_item:
                # Update Name
                if not db_item.name:
                    db_item.name = item_info.get("name")

                # Update Icon URL with CDN prefix
                raw_img = item_info.get("image")
                if raw_img and not db_item.icon_url:
                    # Remove leading slash if exists and add official CDN
                    clean_path = raw_img.lstrip("/")
                    db_item.icon_url = f"https://web.poecdn.com/{clean_path}"

                print(f"Updated metadata for {item_id}")

        db.commit()
        print("✨ Metadata initialization complete!")

    except Exception as e:
        print(f"❌ Error fetching metadata: {e}")
        db.rollback()


if __name__ == "__main__":
    # 1. Seed the basic items and gold taxes first
    seed_gold_taxes()

    # 2. Open a new database session for the metadata fetcher
    db_session = SessionLocal()
    try:
        fetch_metadata_from_ninja(db_session)
    finally:
        db_session.close()
        print("✨ Full database initialization successfully completed!")
