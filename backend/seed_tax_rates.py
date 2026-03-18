import json
import os
from backend.database import SessionLocal, Item, GoldTaxRate


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


if __name__ == "__main__":
    seed_gold_taxes()
