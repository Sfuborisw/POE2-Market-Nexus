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
- **Turn databases:** sudo service postgresql start
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

## 🤖 Automation (Cron Job)

To keep market data up-to-date, we use **Cron** on Ubuntu to automate the execution of the scraping script.

### 1. Get Absolute Paths
Before setting up the Cron Job, you need to confirm the absolute paths for the Python executable and the script:
- **Python Path**: Run `which python3` inside the virtual environment (typical path is `/mnt/c/Users/Metrotown/Documents/Git/POE2-Market-Nexus/venv/bin/python3`).
- **Script Path**: The full absolute path to `price_fetcher.py`.

### 2. Configure Crontab
Open the Cron editor:
```bash
crontab -e
```
Add the following line to the bottom of the file (this schedules the script to run automatically at the top of every hour):
```bash
0 * * * * /YourPythonAbsPath YourScriptAbsPath >> YourLogAbsPath 2>&1
```

### 3. Verify Execution Status
You can check the log file to verify if the script is running correctly:
```bash
cat YourLogAbsPath
```

## 🚀 Getting Started

This project consists of a FastAPI backend and a React (Vite) frontend.

### 1. Backend (FastAPI)
Ensure your PostgreSQL service is running before starting the backend.
```bash
# Navigate to the root directory
# Ensure your virtual environment is active
source venv/bin/activate  # On Ubuntu/Git Bash
```

# Start the FastAPI server
uvicorn backend.main:app --reload
The API will be available at http://127.0.0.1:8000.

2. Frontend (React + Vite)
The frontend requires Node.js and npm.

Bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
The dashboard will be available at http://localhost:5173.

🗄️ Database
Make sure to check your PostgreSQL status:

```
Bash
sudo service postgresql start
```
