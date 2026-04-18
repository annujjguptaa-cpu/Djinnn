import requests
import sys

def main():
    try:
        res = requests.post("http://localhost:8000/api/post/stream", json={
            "image_paths": ["e9eeac48_Chirag-removebg-preview.png"],
            "context": "Testing image description",
            "platform": "linkedin"
        }, stream=True)
        
        for chunk in res.iter_content(chunk_size=1024):
            if chunk:
                sys.stdout.buffer.write(chunk)
    except Exception as e:
        print("EXCEPTION:", e)

if __name__ == "__main__":
    main()
