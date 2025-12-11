"""
Quick test - does the model actually load with pyfunc?
"""
import os
import mlflow

# Set credentials
os.environ['MLFLOW_TRACKING_USERNAME'] = 'MuzammilAhmedBhatti'
os.environ['MLFLOW_TRACKING_PASSWORD'] = 'c3c0eff896115a71905bea5aba8dc52b0ae01305'

# Set tracking URI
mlflow.set_tracking_uri('https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow')

print("Loading model...")
model = mlflow.pyfunc.load_model('models:/cricket_shot_detector/Production')
print(f"SUCCESS! Model loaded: {type(model)}")
print("Model is ready to make predictions!")
