# Cricket Shot Detection - Quick Start Guide

## 🚀 Quick Start

### 1. Prerequisites Check
Make sure you have installed:
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose

Verify installation:
```powershell
docker --version
docker-compose --version
```

### 2. Environment Setup
The `.env` file is already configured with your credentials. If needed, update:
- `DAGSHUB_TOKEN` - Your DagsHub personal access token
- `MODEL_NAME` - Name of your model in MLFlow registry
- `MODEL_STAGE` - Model stage (Production/Staging/None)

### 3. Start All Services
Open PowerShell in the project directory and run:

```powershell
# Start all services in detached mode
docker-compose up -d
```

This will start:
- ✅ MongoDB (Port 27017)
- ✅ PostgreSQL (for Airflow)
- ✅ Airflow Webserver (Port 8080)
- ✅ Airflow Scheduler
- ✅ Flask Application (Port 5000)

### 4. Wait for Services to Initialize
First-time startup takes 2-3 minutes. Check status:

```powershell
# Check running containers
docker-compose ps

# Check logs
docker-compose logs -f flask-app
```

### 5. Access the Applications

#### Flask Web Application
🌐 **URL**: http://localhost:5000

Features:
- Upload cricket shot images
- Get AI predictions with confidence scores
- View recent predictions
- Monitor statistics

#### Airflow Dashboard
🌐 **URL**: http://localhost:8080
- **Username**: airflow
- **Password**: airflow

Features:
- Monitor pipeline execution
- View DAG runs
- Check logs
- Schedule tasks

### 6. Test the System

1. **Open Flask App**: Navigate to http://localhost:5000
2. **Upload Image**: Click the upload area and select a cricket shot image
3. **Get Prediction**: Click "Detect Cricket Shot"
4. **View Results**: See the predicted shot type and confidence
5. **Check Airflow**: Go to http://localhost:8080 and trigger the DAG

### 7. Common Commands

```powershell
# View logs for specific service
docker-compose logs -f flask-app
docker-compose logs -f airflow-webserver

# Restart a service
docker-compose restart flask-app

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

### 8. Troubleshooting

#### Model Loading Issues
If model fails to load:
1. Check DagsHub token is correct
2. Verify model name and stage in `.env`
3. Check MLFlow tracking URI
4. View logs: `docker-compose logs -f flask-app`

#### Airflow Not Accessible
1. Wait 2-3 minutes for initialization
2. Check: `docker-compose logs -f airflow-webserver`
3. Ensure port 8080 is not in use

#### Database Connection Issues
1. Check MongoDB is running: `docker-compose ps mongodb`
2. View logs: `docker-compose logs -f mongodb`
3. Verify credentials in `.env`

### 9. Monitoring

#### Check Service Health
```powershell
# Flask app health
curl http://localhost:5000/health

# Get model info
curl http://localhost:5000/model-info

# Get statistics
curl http://localhost:5000/statistics
```

### 10. Development Workflow

For development, you can run Flask locally without Docker:

```powershell
# Navigate to app directory
cd app

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app.py
```

## 📊 Next Steps

1. **Train More Models**: Train improved models in Colab and register to MLFlow
2. **Update Model**: Change `MODEL_STAGE` in `.env` to test different versions
3. **Customize**: Modify `class_names` in `model_loader.py` for your shots
4. **Scale**: Add more workers in docker-compose for production
5. **Monitor**: Set up Airflow alerts for pipeline failures

## 🔗 Useful Links

- **DagsHub Project**: https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection
- **MLFlow UI**: https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow
- **Airflow Docs**: https://airflow.apache.org/docs/

## 🆘 Need Help?

If you encounter issues:
1. Check logs: `docker-compose logs -f [service-name]`
2. Verify environment variables
3. Ensure all services are healthy: `docker-compose ps`
4. Try fresh start: `docker-compose down -v && docker-compose up -d`

## 📝 Important Notes

- **First Run**: Takes 2-3 minutes to download images and initialize
- **Model Loading**: Happens on first request to Flask app
- **Data Persistence**: MongoDB and Postgres data is stored in Docker volumes
- **Updates**: Changes to code require rebuild: `docker-compose up -d --build`
