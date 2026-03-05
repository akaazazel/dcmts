import requests
import uuid

BASE_URL = "http://127.0.0.1:8000"

print("Testing Root Endpoint...")
try:
    res = requests.get(f"{BASE_URL}/")
    print(f"Status: {res.status_code}, Body: {res.text}")
except Exception as e:
    print(f"Root endpoint failed: {e}")

print("\nTesting Registration...")
test_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
payload = {
    "name": "Test User",
    "email": test_email,
    "password": "password123",
    "role": "student"
}
try:
    res = requests.post(f"{BASE_URL}/auth/register", json=payload)
    print(f"Status: {res.status_code}, Body: {res.text}")
except Exception as e:
    print(f"Registration failed: {e}")
