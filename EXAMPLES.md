# 🏏 Cricket Shot Detection - Example Commands & Usage

## 🚀 Initial Setup

```powershell
# 1. Navigate to project directory
cd D:\MLOPS_PROJECT_CRICKET

# 2. Verify Docker is running
docker --version
docker-compose --version

# 3. Review and update .env file
notepad .env
# Update DAGSHUB_TOKEN with your actual token

# 4. Start all services
.\manage.ps1 start
# OR
docker-compose up -d

# 5. Wait 30 seconds for services to initialize
Start-Sleep -Seconds 30

# 6. Check status
.\manage.ps1 status
```

## 🌐 Accessing Services

```powershell
# Open Flask App in browser
start http://localhost:5000

# Open Airflow UI in browser
start http://localhost:8080

# Login to Airflow: airflow / airflow
```

## 🧪 Testing Endpoints

### Using PowerShell (Invoke-RestMethod)

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get | ConvertTo-Json

# Get model information
Invoke-RestMethod -Uri "http://localhost:5000/model-info" -Method Get | ConvertTo-Json

# Get statistics
Invoke-RestMethod -Uri "http://localhost:5000/statistics" -Method Get | ConvertTo-Json

# Get recent predictions
Invoke-RestMethod -Uri "http://localhost:5000/recent-predictions?limit=5" -Method Get | ConvertTo-Json
```

### Using curl (if installed)

```bash
# Health check
curl http://localhost:5000/health

# Model info
curl http://localhost:5000/model-info

# Statistics
curl http://localhost:5000/statistics

# Recent predictions
curl http://localhost:5000/recent-predictions?limit=10
```

## 📤 Making Predictions

### Via Web Interface
```powershell
# 1. Open browser
start http://localhost:5000

# 2. Click upload area or drag image
# 3. Select cricket shot image (JPG, PNG, JPEG)
# 4. Click "Detect Cricket Shot"
# 5. View prediction and confidence score
```

### Via API (PowerShell)

```powershell
# Prepare image file
$imagePath = "C:\path\to\cricket_shot.jpg"

# Create multipart form data
$form = @{
    file = Get-Item -Path $imagePath
}

# Make prediction request
$response = Invoke-RestMethod -Uri "http://localhost:5000/predict" -Method Post -Form $form

# View result
$response | ConvertTo-Json

# Example response:
# {
#   "success": true,
#   "prediction": "Cover Drive",
#   "confidence": 94.5,
#   "image_url": "/static/uploads/cricket_shot.jpg"
# }
```

### Via API (Python)

```python
import requests

# Upload and predict
url = "http://localhost:5000/predict"
files = {'file': open('cricket_shot.jpg', 'rb')}
response = requests.post(url, files=files)

result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}%")
```

## 📊 MongoDB Operations

### Connect to MongoDB

```powershell
# Access MongoDB shell
docker exec -it cricket_mongodb mongosh -u admin -p cricket_admin_2024

# Or using connection string
mongosh "mongodb://admin:cricket_admin_2024@localhost:27017"
```

### Query Predictions

```javascript
// Switch to database
use cricket_predictions

// Count total predictions
db.predictions.count()

// Get latest predictions
db.predictions.find().sort({timestamp: -1}).limit(5)

// Get predictions for specific shot
db.predictions.find({prediction: "Cover Drive"})

// Get high confidence predictions
db.predictions.find({confidence: {$gt: 0.9}})

// Aggregation - count by prediction type
db.predictions.aggregate([
  {$group: {_id: "$prediction", count: {$sum: 1}}},
  {$sort: {count: -1}}
])

// Get predictions from last 24 hours
db.predictions.find({
  timestamp: {
    $gte: new Date(Date.now() - 24*60*60*1000)
  }
})

// Average confidence score
db.predictions.aggregate([
  {$group: {_id: null, avgConfidence: {$avg: "$confidence"}}}
])
```

## 🔄 Airflow Operations

### Using Airflow UI

```powershell
# Open Airflow
start http://localhost:8080

# Login: airflow / airflow

# Enable DAG
# 1. Go to DAGs page
# 2. Find "cricket_shot_detection_pipeline"
# 3. Toggle ON

# Trigger DAG manually
# 1. Click on DAG name
# 2. Click "Trigger DAG" button (play icon)
# 3. View execution in Graph or Grid view
```

### Using Airflow CLI

```powershell
# List DAGs
docker exec cricket_airflow_webserver airflow dags list

# Trigger DAG
docker exec cricket_airflow_webserver airflow dags trigger cricket_shot_detection_pipeline

# List DAG runs
docker exec cricket_airflow_webserver airflow dags list-runs -d cricket_shot_detection_pipeline

# View task logs
docker exec cricket_airflow_webserver airflow tasks logs cricket_shot_detection_pipeline check_mlflow_connection 2025-12-09
```

## 📝 Viewing Logs

### All services

```powershell
# View all logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View logs for specific service
docker-compose logs flask-app
docker-compose logs airflow-webserver
docker-compose logs mongodb

# Follow specific service logs
docker-compose logs -f flask-app

# View last 100 lines
docker-compose logs --tail=100 flask-app
```

### Using management script

```powershell
# View Flask app logs
.\manage.ps1 logs
```

## 🔧 Service Management

### Start/Stop Services

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart flask-app
docker-compose restart airflow-webserver

# Restart all services
docker-compose restart

# Stop specific service
docker-compose stop flask-app

# Start specific service
docker-compose start flask-app
```

### Scale Services

```powershell
# Scale Flask app to 3 instances (requires load balancer setup)
docker-compose up -d --scale flask-app=3
```

## 🔍 Debugging

### Check container status

```powershell
# List running containers
docker-compose ps

# List all containers (including stopped)
docker-compose ps -a

# View container resource usage
docker stats
```

### Execute commands in containers

```powershell
# Access Flask app container
docker exec -it cricket_flask_app bash

# Access MongoDB container
docker exec -it cricket_mongodb mongosh

# Access Airflow webserver
docker exec -it cricket_airflow_webserver bash

# Run Python in Flask container
docker exec -it cricket_flask_app python

# Check Python packages
docker exec cricket_flask_app pip list
```

### Inspect container

```powershell
# View container details
docker inspect cricket_flask_app

# View container logs
docker logs cricket_flask_app

# Follow container logs
docker logs -f cricket_flask_app
```

## 🧹 Cleanup Operations

### Remove stopped containers

```powershell
# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes
docker-compose down -v

# Stop, remove containers, volumes, and images
docker-compose down -v --rmi all
```

### Clean using management script

```powershell
# Clean environment (removes containers and volumes)
.\manage.ps1 clean
```

### Manual cleanup

```powershell
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused
docker system prune -a
```

## 💾 Backup & Restore

### Backup MongoDB

```powershell
# Using management script
.\manage.ps1 backup

# Manual backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
docker exec cricket_mongodb mongodump --username admin --password cricket_admin_2024 --out /backup
docker cp cricket_mongodb:/backup ./backups/mongodb_$timestamp
```

### Restore MongoDB

```powershell
# Copy backup to container
docker cp ./backups/mongodb_20251209 cricket_mongodb:/restore

# Restore database
docker exec cricket_mongodb mongorestore --username admin --password cricket_admin_2024 /restore
```

### Backup Docker Volumes

```powershell
# List volumes
docker volume ls

# Backup MongoDB volume
docker run --rm -v mongodb_data:/data -v ${PWD}/backups:/backup ubuntu tar cvf /backup/mongodb_volume.tar /data
```

## 🔄 Update Model

### When you have a new model

```powershell
# 1. Update model stage in .env
# Edit .env file, change:
# MODEL_STAGE=Staging  # or Production

# 2. Restart Flask app
docker-compose restart flask-app

# 3. Verify model loaded
Invoke-RestMethod -Uri "http://localhost:5000/model-info" -Method Get | ConvertTo-Json

# 4. Test prediction
start http://localhost:5000
```

## 📈 Monitoring

### Check system health

```powershell
# Run automated tests
.\manage.ps1 test

# Check individual endpoints
curl http://localhost:5000/health
curl http://localhost:8080/health
```

### Monitor resource usage

```powershell
# Real-time statistics
docker stats

# Specific container
docker stats cricket_flask_app
```

### View metrics

```powershell
# Get prediction statistics
Invoke-RestMethod -Uri "http://localhost:5000/statistics" -Method Get | ConvertTo-Json

# Get recent predictions
Invoke-RestMethod -Uri "http://localhost:5000/recent-predictions?limit=10" -Method Get | ConvertTo-Json
```

## 🔄 Development Workflow

### Local development (without Docker)

```powershell
# 1. Create virtual environment
cd app
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variables
$env:DAGSHUB_TOKEN="your_token"
$env:MLFLOW_TRACKING_URI="https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow"
$env:MODEL_NAME="cricket_shot_detector"
$env:MODEL_STAGE="Production"

# 4. Run Flask app
python app.py

# 5. Access at http://localhost:5000
```

### Update and rebuild

```powershell
# 1. Make code changes
notepad app/app.py

# 2. Rebuild and restart
.\manage.ps1 build

# Or manually
docker-compose up -d --build
```

## 📊 Performance Testing

### Load testing with Apache Bench

```bash
# Install Apache Bench (if not installed)

# Test health endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:5000/health

# Test model-info endpoint
ab -n 50 -c 5 http://localhost:5000/model-info
```

### Load testing with Python

```python
import requests
import time
from concurrent.futures import ThreadPoolExecutor

def test_health():
    response = requests.get('http://localhost:5000/health')
    return response.status_code == 200

def test_prediction():
    files = {'file': open('test_image.jpg', 'rb')}
    response = requests.post('http://localhost:5000/predict', files=files)
    return response.status_code == 200

# Run concurrent tests
with ThreadPoolExecutor(max_workers=10) as executor:
    start = time.time()
    futures = [executor.submit(test_health) for _ in range(100)]
    results = [f.result() for f in futures]
    duration = time.time() - start
    
    print(f"Completed 100 requests in {duration:.2f} seconds")
    print(f"Success rate: {sum(results)/len(results)*100:.1f}%")
```

## 🎯 Production Checklist

Before going to production:

```powershell
# 1. Update passwords
# Edit .env file:
# - Change MONGO_INITDB_ROOT_PASSWORD
# - Generate new SECRET_KEY
# - Verify DAGSHUB_TOKEN

# 2. Test all endpoints
.\manage.ps1 test

# 3. Verify model loads
curl http://localhost:5000/model-info

# 4. Check logs for errors
docker-compose logs --tail=100

# 5. Enable HTTPS (add nginx)
# 6. Set up monitoring
# 7. Configure backups
# 8. Update firewall rules
```

## 🆘 Common Issues & Solutions

### Issue: Model not loading

```powershell
# Check logs
docker-compose logs flask-app | Select-String "Error"

# Verify environment variables
docker exec cricket_flask_app printenv | Select-String "MLFLOW"

# Test MLFlow connection manually
docker exec cricket_flask_app python -c "import mlflow; mlflow.set_tracking_uri('$env:MLFLOW_TRACKING_URI'); print(mlflow.get_tracking_uri())"
```

### Issue: Can't access Flask app

```powershell
# Check if container is running
docker-compose ps flask-app

# Check if port is in use
netstat -ano | findstr :5000

# Restart Flask app
docker-compose restart flask-app

# View detailed logs
docker-compose logs -f flask-app
```

### Issue: Airflow not starting

```powershell
# Check initialization
docker-compose logs airflow-init

# Check PostgreSQL
docker-compose logs postgres

# Restart Airflow services
docker-compose restart airflow-webserver airflow-scheduler
```

## 📚 Additional Resources

### Documentation
```powershell
# View README
cat README.md

# View quick start
cat QUICKSTART.md

# View architecture
cat ARCHITECTURE.md

# View deployment guide
cat DEPLOYMENT.md

# View model update guide
cat MODEL_UPDATE.md
```

### Useful Links

- DagsHub MLFlow: https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow
- MLFlow Docs: https://mlflow.org/docs/latest/
- Docker Compose Docs: https://docs.docker.com/compose/
- Airflow Docs: https://airflow.apache.org/docs/

---

💡 **Tip**: Save frequently used commands in a PowerShell profile or create aliases for quicker access!

🎯 **Remember**: Always check logs when something doesn't work: `.\manage.ps1 logs`
