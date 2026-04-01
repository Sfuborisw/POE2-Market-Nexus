import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()
league = os.getenv("POE_LEAGUE", "Fate+of+the+Vaal")

URL = f"https://poe.ninja/poe2/api/economy/exchange/current/overview?league={league}&type=Currency"
headers = {"User-Agent": "Mozilla/5.0"}


def fetch_raw_json():
    print("📡 Requesting RAW data from Poe.ninja...")
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        data = response.json()

        # Write the entire JSON to a file for easy viewing in VSCode
        file_path = os.path.join(os.getcwd(), "raw_poe_data.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

        print(f"✅ Success! RAW data saved at: {file_path}")

        # Print the first record in 'lines' to the Terminal for a quick look
        print("\n🔍 First record in 'lines' array (Sneak Peek):")
        if data.get("lines"):
            print(json.dumps(data["lines"][0], indent=4))
        else:
            print("❌ 'lines' array is empty!")

    except Exception as e:
        print(f"❌ Error occurred: {e}")


if __name__ == "__main__":
    fetch_raw_json()
