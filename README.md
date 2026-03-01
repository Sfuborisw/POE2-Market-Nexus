# POE2 Market Nexus 📈

This is a data-driven project designed to track and analyze the economy of Path of Exile 2. It automatically fetches market data from Poe.ninja and stores it in a normalized PostgreSQL database for historical analysis.

## 🚀 Getting Started

### Prerequisites
- **OS**: Windows 11 with Ubuntu (WSL2)
- **Database**: PostgreSQL
- **Python**: 3.12+

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/Sfuborisw/POE2-Market-Nexus.git](https://github.com/Sfuborisw/POE2-Market-Nexus.git)
   cd POE2-Market-Nexus
   ```

2. Set up Virtual Environment:
    ```Bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. Configure Environment Variables:
Create a .env file in the root directory:

    ```Code snippet
    DATABASE_URL=postgresql://your_user:your_password@localhost:5432/poe2_nexus
    ```


## 🛠️ Data Ingestion
To fetch the latest currency prices and sync them to the database, run:
    ```Bash
    python3 scraper/price_fetcher.py
    ```

## 📊 Database Management (CLI)
Since we are using PostgreSQL on Ubuntu, you can manage the data directly via the terminal.

How to enter SQL Interface:
    ```bash
    # Using TCP/IP connection (Recommended for WSL2)
    psql -h localhost -p 5432 -U boris -d poe2_nexus
    ```

### Useful SQL Commands:
- **List all tables:** \dt
- **View table structure:** \d table_name (e.g., \d price_history)
- **Check latest 5 prices:**
    ```SQL
    SELECT i.name, p.price_value, p.timestamp
    FROM price_history p
    JOIN items i ON p.item_id = i.id
    ORDER BY p.timestamp DESC
    LIMIT 5;
- **Exit psql:** \q or type exit