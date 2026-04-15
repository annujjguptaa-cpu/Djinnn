import json
import os

WISHES_FILE = "wishes_db.json"

def load_db():
    if os.path.exists(WISHES_FILE):
        try:
            with open(WISHES_FILE, "r") as f:
                return json.load(f)
        except:
            pass
    return {"post": {}, "connect": {}}

def save_db(data):
    with open(WISHES_FILE, "w") as f:
        json.dump(data, f, indent=2)

# Global Instance
_db = load_db()

def get_post_wishes():
    return _db["post"]

def get_connect_wishes():
    return _db["connect"]

def sync_db():
    save_db(_db)
