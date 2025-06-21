from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI=os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)

db = client["tingting"]
activities = db["activities"]

def fetch_all_activities():
    """Fetch all activities from the activities collection."""
    return list(activities.find())

print("Connected ✅")
print(activities.find_one())
