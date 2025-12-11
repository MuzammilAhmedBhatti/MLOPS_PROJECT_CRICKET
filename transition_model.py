"""
Script to transition cricket_shot_detector model to Production stage
"""
import os
import mlflow
from mlflow.tracking import MlflowClient

# Configuration from your DagsHub
MLFLOW_TRACKING_URI = "https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow"
DAGSHUB_USERNAME = "MuzammilAhmedBhatti"
DAGSHUB_TOKEN = "c3c0eff896115a71905bea5aba8dc52b0ae01305"
MODEL_NAME = "cricket_shot_detector"

print("="*70)
print("🏏 Transitioning Cricket Shot Detector Model to Production")
print("="*70)

# Set up MLFlow authentication
os.environ['MLFLOW_TRACKING_USERNAME'] = DAGSHUB_USERNAME
os.environ['MLFLOW_TRACKING_PASSWORD'] = DAGSHUB_TOKEN
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)

print(f"\n📊 MLFlow Tracking URI: {MLFLOW_TRACKING_URI}")
print(f"👤 Username: {DAGSHUB_USERNAME}")
print(f"🤖 Model Name: {MODEL_NAME}\n")

try:
    # Create MLFlow client
    client = MlflowClient()
    
    # Get all versions of the model
    print(f"🔍 Fetching all versions of '{MODEL_NAME}'...")
    all_versions = client.search_model_versions(f"name='{MODEL_NAME}'")
    
    if not all_versions:
        print(f"❌ ERROR: No model found with name '{MODEL_NAME}'")
        print("\n💡 Available models:")
        for model in client.search_registered_models():
            print(f"   - {model.name}")
        exit(1)
    
    print(f"✅ Found {len(all_versions)} version(s)\n")
    
    # Show all versions
    print("📦 Model Versions:")
    for version in all_versions:
        print(f"   Version {version.version}: Stage = {version.current_stage}, Status = {version.status}")
    
    # Get the latest version
    latest_version = max([int(v.version) for v in all_versions])
    print(f"\n🎯 Latest version: {latest_version}")
    
    # Transition to Production
    print(f"\n⚡ Transitioning version {latest_version} to Production...")
    client.transition_model_version_stage(
        name=MODEL_NAME,
        version=latest_version,
        stage="Production",
        archive_existing_versions=True  # Archive old production versions
    )
    
    print(f"✅ SUCCESS! Model v{latest_version} is now in Production stage!")
    print(f"\n🎉 Your Flask app will now be able to load the model!")
    
    # Verify
    print(f"\n🔍 Verifying...")
    prod_versions = client.get_latest_versions(MODEL_NAME, stages=["Production"])
    if prod_versions:
        print(f"✅ Confirmed: Version {prod_versions[0].version} is in Production")
    
    print("\n" + "="*70)
    print("✅ DONE! You can now restart your Flask app:")
    print("   docker-compose restart flask-app")
    print("="*70)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nFull traceback:")
    import traceback
    traceback.print_exc()
    print("\n💡 If you see authentication errors, please check:")
    print("   1. DagsHub token is correct")
    print("   2. Token has write permissions")
    print("   3. Internet connection is working")
