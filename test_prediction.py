import requests
import json

# Create a test prediction
url = "http://localhost:5000/predict"

# We need an actual image file for testing
# Let's create a simple test image
from PIL import Image
import io

# Create a simple test image (green cricket field)
img = Image.new('RGB', (224, 224), color=(34, 139, 34))
img_bytes = io.BytesIO()
img.save(img_bytes, format='JPEG')
img_bytes.seek(0)

# Make the request
files = {'file': ('test_cricket.jpg', img_bytes, 'image/jpeg')}

print("Making prediction request...")
try:
    response = requests.post(url, files=files, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ SUCCESS!")
        print(f"Prediction: {result.get('prediction')}")
        print(f"Confidence: {result.get('confidence')}%")
    else:
        print(f"\n❌ Error: {response.text}")
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
