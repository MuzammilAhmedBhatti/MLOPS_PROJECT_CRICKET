"""
Script to test if model loads correctly from DagsHub MLFlow
"""
import os
import mlflow
import mlflow.keras

# Set credentials
os.environ['MLFLOW_TRACKING_USERNAME'] = 'MuzammilAhmedBhatti'
os.environ['MLFLOW_TRACKING_PASSWORD'] = 'c3c0eff896115a71905bea5aba8dc52b0ae01305'

# Set tracking URI
mlflow.set_tracking_uri('https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow')

print("\n" + "="*60)
print("Testing MLFlow Keras Model Loading")
print("="*60 + "\n")

# Try to load the model
model_uri = "models:/cricket_shot_detector/Production"
print(f"Loading from: {model_uri}\n")

try:
    print("⏳ Downloading and loading model...")
    print("   (This may take 2-3 minutes on first run)\n")
    
    model = mlflow.keras.load_model(model_uri)
    
    print("✅ SUCCESS! Model loaded!")
    print(f"📊 Model type: {type(model)}")
    print(f"📊 Model architecture:")
    model.summary()
    
    print("\n✅ Model is ready to make predictions!")
    
except Exception as e:
    print(f"\n❌ ERROR: Failed to load model")
    print(f"Error: {str(e)}\n")
    
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
