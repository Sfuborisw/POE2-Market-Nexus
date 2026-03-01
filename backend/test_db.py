from database import engine, Base
import models

print("Attempting to create tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
except Exception as e:
    print(f"Error: {e}")
