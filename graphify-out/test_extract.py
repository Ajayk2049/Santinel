import sys, json
from graphify.extract import extract_one
from pathlib import Path

file = Path('backend/src/main/java/com/sentinel/controllers/ServiceController.java')
try:
    result = extract_one(file)
    print(f'Success: {len(result["nodes"])} nodes')
except Exception as e:
    print(f'Error: {e}')
