# Model Update Guide

## Overview

This guide explains how to update your cricket shot detection model when you train a new version in Google Colab.

## Prerequisites

- Trained model in Google Colab
- DagsHub account connected to your project
- MLFlow tracking URI configured
- Model performs better than current version

## Step-by-Step Process

### 1. Train Model in Google Colab

```python
# In your Colab notebook

import tensorflow as tf
from tensorflow import keras
import dagshub
import mlflow
import mlflow.keras

# Initialize DagsHub
dagshub.init(
    repo_name='cricket-shot-detection',
    repo_owner='MuzammilAhmedBhatti',
    mlflow=True
)

# Set MLFlow tracking
mlflow.set_tracking_uri('https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow')

# Start MLFlow run
with mlflow.start_run(run_name='cricket_shot_detector_v2'):
    # Train your model
    model = keras.Sequential([
        # Your model architecture
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Train
    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=50,
        callbacks=[...]
    )
    
    # Log metrics
    mlflow.log_metric("accuracy", history.history['accuracy'][-1])
    mlflow.log_metric("val_accuracy", history.history['val_accuracy'][-1])
    mlflow.log_metric("loss", history.history['loss'][-1])
    
    # Log parameters
    mlflow.log_param("epochs", 50)
    mlflow.log_param("batch_size", 32)
    mlflow.log_param("optimizer", "adam")
    
    # Log model
    mlflow.keras.log_model(
        model,
        artifact_path="model",
        registered_model_name="cricket_shot_detector"
    )
    
    print("✅ Model logged to MLFlow!")
```

### 2. Register Model in MLFlow

After training, go to DagsHub MLFlow UI:

1. Navigate to: https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow
2. Go to **Models** tab
3. Find your model: `cricket_shot_detector`
4. View latest version
5. Check metrics and artifacts

### 3. Transition Model to Staging

Before moving to production, test in staging:

**Via DagsHub UI**:
1. Click on the model version
2. Click "Transition to Staging"
3. Add notes about changes

**Via Python**:
```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Transition to Staging
client.transition_model_version_stage(
    name="cricket_shot_detector",
    version=2,  # Your new version number
    stage="Staging"
)
```

### 4. Test Staging Model

Update `.env` to test staging model:

```env
MODEL_STAGE=Staging
```

Restart Flask app:
```powershell
docker-compose restart flask-app
```

Test predictions:
- Upload test images
- Verify predictions are accurate
- Check confidence scores
- Monitor for errors

### 5. Transition to Production

Once satisfied with staging performance:

**Via DagsHub UI**:
1. Go to model version
2. Click "Transition to Production"
3. Previous production version becomes "Archived"

**Via Python**:
```python
client.transition_model_version_stage(
    name="cricket_shot_detector",
    version=2,
    stage="Production"
)
```

### 6. Deploy Production Model

Update `.env`:
```env
MODEL_STAGE=Production
```

Restart services:
```powershell
.\manage.ps1 restart
```

Or manually:
```powershell
docker-compose restart flask-app
```

### 7. Monitor Performance

After deployment:
- Monitor prediction accuracy
- Check response times
- Review user feedback
- Track error rates

Use Airflow DAG to monitor:
- Go to http://localhost:8080
- View `cricket_shot_detection_pipeline`
- Check task logs

## Model Versioning Best Practices

### Version Naming Convention

Use semantic versioning or descriptive names:
```
v1.0.0 - Initial model
v1.1.0 - Added data augmentation
v2.0.0 - Changed architecture
v2.0.1 - Bug fix in preprocessing
```

### Experiment Tracking

Log everything in MLFlow:
```python
with mlflow.start_run():
    # Model parameters
    mlflow.log_param("model_architecture", "ResNet50")
    mlflow.log_param("input_shape", "224x224x3")
    mlflow.log_param("num_classes", 10)
    
    # Training parameters
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("batch_size", 32)
    mlflow.log_param("epochs", 50)
    
    # Data parameters
    mlflow.log_param("train_samples", 5000)
    mlflow.log_param("val_samples", 1000)
    mlflow.log_param("data_augmentation", True)
    
    # Metrics
    mlflow.log_metric("accuracy", 0.95)
    mlflow.log_metric("val_accuracy", 0.93)
    mlflow.log_metric("precision", 0.94)
    mlflow.log_metric("recall", 0.92)
    mlflow.log_metric("f1_score", 0.93)
    
    # Artifacts
    mlflow.log_artifact("training_plot.png")
    mlflow.log_artifact("confusion_matrix.png")
```

### A/B Testing

Test new model against current production:

1. **Deploy both versions**:
   - Current: Production stage
   - New: Staging stage

2. **Split traffic**:
   - 80% to production
   - 20% to staging

3. **Compare metrics**:
   - Accuracy
   - Response time
   - User satisfaction

4. **Gradual rollout**:
   - 20% → 50% → 80% → 100%

## Updating Class Names

If your new model has different classes:

### 1. Update `class_names.json`

```json
[
  "Cover Drive",
  "Pull Shot",
  "Cut Shot",
  "Straight Drive",
  "Sweep",
  "Hook Shot",
  "New Shot Type 1",
  "New Shot Type 2"
]
```

### 2. Update `model_loader.py`

```python
# Load from JSON file
import json

with open('class_names.json', 'r') as f:
    class_names = json.load(f)

model_loader.set_class_names(class_names)
```

### 3. Update Frontend

If needed, update the UI to display new classes properly.

## Rollback Procedure

If new model has issues:

### Quick Rollback

**Method 1: Change Stage**
```env
# In .env
MODEL_STAGE=Production  # Use previous production version
```

**Method 2: Transition Previous Version**
```python
client.transition_model_version_stage(
    name="cricket_shot_detector",
    version=1,  # Previous version
    stage="Production"
)
```

### Emergency Rollback

```powershell
# 1. Stop services
docker-compose down

# 2. Update .env to previous version
# Edit MODEL_STAGE or MODEL_NAME

# 3. Restart
docker-compose up -d

# 4. Verify
.\manage.ps1 test
```

## Model Performance Monitoring

### Key Metrics to Track

1. **Accuracy Metrics**:
   - Overall accuracy
   - Per-class accuracy
   - Confidence distribution

2. **Performance Metrics**:
   - Prediction latency
   - Throughput (predictions/sec)
   - Memory usage

3. **Business Metrics**:
   - User satisfaction
   - Usage patterns
   - Error rates

### Automated Monitoring

Set up Airflow DAG to:
```python
def monitor_model_performance():
    # Get predictions from last 24 hours
    predictions = get_recent_predictions(hours=24)
    
    # Calculate metrics
    accuracy = calculate_accuracy(predictions)
    avg_confidence = calculate_avg_confidence(predictions)
    
    # Log to MLFlow
    with mlflow.start_run():
        mlflow.log_metric("daily_accuracy", accuracy)
        mlflow.log_metric("avg_confidence", avg_confidence)
    
    # Alert if metrics degrade
    if accuracy < 0.85:
        send_alert("Model accuracy dropped below threshold")
```

## Continuous Improvement

### Regular Model Updates

Schedule regular retraining:
1. **Monthly**: Retrain with new data
2. **Quarterly**: Architecture improvements
3. **Annually**: Major overhaul

### Data Collection

Improve model with production data:
```python
# In Flask app, save predictions for retraining
def save_for_training(image, prediction, confidence):
    # Save low confidence predictions for review
    if confidence < 0.7:
        save_to_review_queue(image, prediction)
    
    # Collect diverse examples
    save_to_training_pool(image, prediction)
```

## Checklist

Before deploying new model:

- [ ] Model trained and logged to MLFlow
- [ ] Metrics tracked and documented
- [ ] Model tested in Colab
- [ ] Transitioned to Staging
- [ ] Tested in staging environment
- [ ] Performance validated
- [ ] Class names updated (if changed)
- [ ] Documentation updated
- [ ] Rollback plan prepared
- [ ] Team notified
- [ ] Monitoring configured
- [ ] Transitioned to Production
- [ ] Verified in production
- [ ] Performance monitored

## Troubleshooting

### Model Not Loading

**Problem**: Flask app can't load new model

**Solutions**:
1. Check model name in MLFlow
2. Verify stage is correct
3. Check DagsHub token permissions
4. View Flask logs: `docker-compose logs flask-app`

### Different Predictions

**Problem**: New model gives unexpected results

**Solutions**:
1. Verify preprocessing is same
2. Check class order matches
3. Validate input shape
4. Test with known examples

### Performance Degradation

**Problem**: New model is slower

**Solutions**:
1. Optimize model architecture
2. Use model quantization
3. Add caching layer
4. Consider model pruning

## Additional Resources

- **MLFlow Documentation**: https://mlflow.org/docs/latest/index.html
- **DagsHub Guide**: https://dagshub.com/docs
- **Model Registry**: https://mlflow.org/docs/latest/model-registry.html
- **TensorFlow Guide**: https://www.tensorflow.org/guide
