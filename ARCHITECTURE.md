# MLOps Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                  (Flask Web Application)                         │
│                    http://localhost:5000                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Flask App  │  │ Model Loader │  │ Image Proc.  │          │
│  │   (Gunicorn) │  │   (MLFlow)   │  │  (Pillow)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA & MODEL LAYER                            │
│  ┌─────────────────┐        ┌────────────────────────┐          │
│  │    MongoDB      │◄──────►│  DagsHub + MLFlow     │          │
│  │  (Predictions)  │        │  (Model Registry)      │          │
│  │  Port: 27017    │        │  (Experiment Tracking) │          │
│  └─────────────────┘        └────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ORCHESTRATION LAYER                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │              Apache Airflow                       │           │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │           │
│  │  │ Webserver  │  │ Scheduler  │  │ PostgreSQL │ │           │
│  │  │ (Port 8080)│  │            │  │            │ │           │
│  │  └────────────┘  └────────────┘  └────────────┘ │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  VERSION CONTROL                                 │
│         GitHub ◄──────► DagsHub                                 │
│      (Code & Config)  (Data & Models)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Flask Application (Port 5000)
- **Technology**: Python Flask + Gunicorn
- **Purpose**: Web interface for predictions
- **Features**:
  - Image upload and preprocessing
  - Model inference via MLFlow
  - Real-time predictions
  - Results storage in MongoDB
  - Statistics and monitoring

### 2. Model Loader (MLFlow)
- **Technology**: MLFlow + DagsHub
- **Purpose**: Load and manage ML models
- **Features**:
  - Dynamic model loading from registry
  - Version management
  - Model validation
  - Experiment tracking

### 3. MongoDB (Port 27017)
- **Technology**: MongoDB 7.0
- **Purpose**: Store predictions and metadata
- **Collections**:
  - `predictions`: Stores all prediction results
  - Schema:
    ```json
    {
      "timestamp": "2025-12-09T23:59:59",
      "image_name": "shot.jpg",
      "prediction": "Cover Drive",
      "confidence": 0.95,
      "model_version": "1"
    }
    ```

### 4. Apache Airflow (Port 8080)
- **Technology**: Airflow 2.8.0 + PostgreSQL
- **Purpose**: Pipeline orchestration and monitoring
- **DAGs**:
  - `cricket_shot_detection_pipeline`: Daily pipeline
    - Check MLFlow connection
    - Validate model
    - Monitor Flask app health
    - Track prediction statistics
    - Log metrics to MLFlow

### 5. DagsHub Integration
- **Purpose**: Centralized ML platform
- **Features**:
  - MLFlow model registry
  - Experiment tracking
  - Git-like data versioning
  - GitHub synchronization
  - Collaboration tools

## Data Flow

### Prediction Flow
```
User Upload Image
    │
    ▼
Flask receives file
    │
    ▼
Image preprocessing (224x224, normalized)
    │
    ▼
Model prediction (from MLFlow)
    │
    ▼
Result saved to MongoDB
    │
    ▼
Response to user (prediction + confidence)
```

### Model Loading Flow
```
Flask app starts
    │
    ▼
Initialize DagsHub connection
    │
    ▼
Set MLFlow tracking URI
    │
    ▼
Authenticate with DagsHub token
    │
    ▼
Load model from registry (Production stage)
    │
    ▼
Model ready for inference
```

### Airflow Monitoring Flow
```
Scheduled trigger (daily)
    │
    ▼
Check MLFlow connection
    │
    ▼
Validate model can be loaded
    │
    ▼
Check Flask app health endpoint
    │
    ▼
Fetch prediction statistics
    │
    ▼
Log metrics to MLFlow
    │
    ▼
Complete pipeline
```

## Technology Stack

### Backend
- **Python 3.10**: Core programming language
- **Flask 3.0**: Web framework
- **Gunicorn 21.2**: WSGI server
- **MLFlow 2.9**: Model management
- **DagsHub 0.3**: ML platform integration

### ML/AI
- **TensorFlow 2.15**: Deep learning framework
- **Keras**: High-level neural networks API
- **Pillow 10.1**: Image processing
- **NumPy 1.24**: Numerical computing

### Database
- **MongoDB 7.0**: Document database
- **PostgreSQL 15**: Relational database (Airflow)
- **PyMongo 4.6**: MongoDB Python driver

### Orchestration
- **Apache Airflow 2.8**: Workflow orchestration
- **Docker Compose**: Container orchestration

### DevOps
- **Docker**: Containerization
- **Git**: Version control
- **DagsHub**: Data/model versioning

## Security

### Authentication
- **DagsHub Token**: Secure model access
- **MongoDB**: Username/password authentication
- **Flask**: Secret key for sessions

### Network
- **Docker Network**: Isolated internal network
- **Port Exposure**: Only necessary ports exposed
- **Environment Variables**: Sensitive data in .env

### Best Practices
- Secrets stored in environment variables
- .env file excluded from Git
- Database credentials protected
- Token-based API authentication

## Scalability Considerations

### Current Setup (Development/Small Scale)
- Single Flask worker (Gunicorn with 2 workers)
- LocalExecutor for Airflow
- Single MongoDB instance

### Production Scaling Options
1. **Horizontal Scaling**:
   - Multiple Flask app replicas
   - Load balancer (Nginx/HAProxy)
   - CeleryExecutor for Airflow
   - MongoDB replica set

2. **Vertical Scaling**:
   - Increase worker count
   - Larger container resources
   - GPU support for inference

3. **Cloud Deployment**:
   - Kubernetes orchestration
   - Managed MongoDB (Atlas)
   - Cloud-based MLFlow
   - Auto-scaling groups

## Monitoring & Observability

### Application Monitoring
- Flask health endpoint (`/health`)
- Model info endpoint (`/model-info`)
- Statistics endpoint (`/statistics`)

### Pipeline Monitoring
- Airflow DAG runs
- Task logs and status
- MLFlow experiment tracking

### Database Monitoring
- MongoDB logs
- Prediction counts
- Distribution analysis

## Maintenance

### Regular Tasks
1. **Model Updates**: Deploy new versions to MLFlow
2. **Database Cleanup**: Archive old predictions
3. **Log Rotation**: Manage Airflow logs
4. **Security Updates**: Update dependencies

### Backup Strategy
1. **MongoDB**: Regular database backups
2. **Models**: Versioned in MLFlow/DagsHub
3. **Code**: Git version control
4. **Configuration**: .env file backups (secure)

## Future Enhancements

1. **Real-time Video Processing**: Frame-by-frame analysis
2. **Batch Predictions**: Process multiple images
3. **Model A/B Testing**: Compare model versions
4. **Advanced Analytics**: Detailed shot analysis
5. **Mobile App**: iOS/Android interface
6. **API Documentation**: Swagger/OpenAPI
7. **Performance Monitoring**: Prometheus + Grafana
8. **CI/CD Pipeline**: Automated testing and deployment
