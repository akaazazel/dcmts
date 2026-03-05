from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.mongo_uri)
db = client[settings.database_name]

# Collections
users_collection = db["users"]
tickets_collection = db["tickets"]
