import sys
import os
from datetime import datetime

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.database import users_collection
    from app.utils.password_utils import hash_password
except ImportError as e:
    print(f"Error: Could not import app modules. Make sure you are running this from the backend directory. {e}")
    sys.exit(1)

def create_admin(name, email, password):
    # Check if user already exists
    if users_collection.find_one({"email": email}):
        print(f"Error: User with email {email} already exists.")
        return

    hashed_password = hash_password(password)
    user_dict = {
        "name": name,
        "email": email,
        "password_hash": hashed_password,
        "role": "admin",
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(user_dict)
    print(f"Admin user created successfully with ID: {result.inserted_id}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python create_admin.py \"Admin Name\" admin@example.com password123")
    else:
        create_admin(sys.argv[1], sys.argv[2], sys.argv[3])
