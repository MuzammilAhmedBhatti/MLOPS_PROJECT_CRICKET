# Deployment Guide

## Prerequisites

- Docker installed and running
- Docker Compose installed
- At least 4GB RAM available
- At least 10GB disk space
- Internet connection for pulling images

## Environment Configuration

Before deploying, ensure your `.env` file is properly configured:

### Required Variables

```env
# DagsHub - Get from https://dagshub.com/user/settings/tokens
DAGSHUB_USERNAME=MuzammilAhmedBhatti
DAGSHUB_REPO=cricket-shot-detection
DAGSHUB_TOKEN=your_dagshub_token_here

# MLFlow - Automatically derived from DagsHub
MLFLOW_TRACKING_URI=https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow
MODEL_NAME=cricket_shot_detector
MODEL_STAGE=Production

# MongoDB - Change for production
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=change_this_password
MONGO_INITDB_DATABASE=cricket_predictions

# Flask Application
FLASK_ENV=production
FLASK_PORT=5000
SECRET_KEY=generate_new_secret_key_here
```

### Generate Secret Key

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

## Deployment Steps

### 1. Development/Local Deployment

```powershell
# Clone repository
git clone https://github.com/MuzammilAhmedBhatti/cricket-shot-detection.git
cd cricket-shot-detection

# Configure environment
# Edit .env file with your credentials

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Production Deployment

#### Option A: Docker Compose (Small Scale)

```powershell
# Pull latest code
git pull origin main

# Build with production settings
docker-compose -f docker-compose.yml up -d --build

# Verify deployment
docker-compose ps
curl http://localhost:5000/health
curl http://localhost:8080/health
```

#### Option B: Kubernetes Deployment (Large Scale)

Coming soon - Will include Kubernetes manifests for:
- Deployment configurations
- Service definitions
- Ingress rules
- ConfigMaps and Secrets
- Persistent Volume Claims
- Horizontal Pod Autoscaler

### 3. Cloud Deployment

#### AWS Deployment

**Using EC2 + Docker Compose**:

```bash
# 1. Launch EC2 instance (Ubuntu 22.04, t2.large or larger)

# 2. Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# 3. Clone and configure
git clone https://github.com/MuzammilAhmedBhatti/cricket-shot-detection.git
cd cricket-shot-detection
nano .env  # Configure environment

# 4. Deploy
docker-compose up -d

# 5. Configure security group
# - Allow port 5000 (Flask)
# - Allow port 8080 (Airflow)
# - Restrict to your IP or VPN
```

**Using ECS (Elastic Container Service)**:
- Create task definitions
- Configure services
- Set up load balancer
- Use RDS for PostgreSQL
- Use DocumentDB for MongoDB

#### Google Cloud Platform

**Using Compute Engine + Docker**:

```bash
# 1. Create VM instance (e2-standard-2 or larger)

# 2. SSH into instance
gcloud compute ssh instance-name

# 3. Install Docker
sudo snap install docker
sudo usermod -aG docker $USER

# 4. Deploy (same as AWS)
```

**Using GKE (Google Kubernetes Engine)**:
- Create GKE cluster
- Deploy using kubectl
- Use Cloud SQL for PostgreSQL
- Use MongoDB Atlas

#### Azure Deployment

**Using Azure Container Instances**:

```bash
# Create resource group
az group create --name cricket-detection --location eastus

# Create container instances
az container create \
  --resource-group cricket-detection \
  --name cricket-flask-app \
  --image your-registry/cricket-app:latest \
  --dns-name-label cricket-app \
  --ports 5000
```

## Service-Specific Configuration

### Flask Application

**Production Settings**:
```python
# In app.py or config file
FLASK_ENV = 'production'
DEBUG = False
TESTING = False
```

**Gunicorn Configuration**:
```bash
# Increase workers for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "app:app"]
```

### Airflow Configuration

**Production Settings**:
- Use CeleryExecutor for distributed task execution
- Configure external PostgreSQL (RDS, Cloud SQL)
- Set up proper authentication
- Enable RBAC

### MongoDB Configuration

**Production Best Practices**:
- Enable authentication
- Use replica sets for high availability
- Regular backups
- Monitor performance
- Index frequently queried fields

```javascript
// Create indexes
db.predictions.createIndex({ "timestamp": -1 })
db.predictions.createIndex({ "prediction": 1 })
```

## SSL/TLS Configuration

### Using Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /airflow/ {
        proxy_pass http://localhost:8080/;
    }
}
```

### Using Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

## Monitoring Setup

### Health Checks

Set up monitoring for:
- Flask app: `http://your-domain:5000/health`
- Airflow: `http://your-domain:8080/health`
- MongoDB: Connection test

### Logging

**Centralized Logging**:
```yaml
# In docker-compose.yml, add logging driver
services:
  flask-app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Metrics Collection

**Using Prometheus**:
- Add Prometheus exporter to Flask
- Monitor Airflow metrics
- MongoDB metrics

## Backup Strategy

### Automated Backups

**MongoDB Backup**:
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
docker exec cricket_mongodb mongodump \
  --username admin \
  --password $MONGO_PASSWORD \
  --out /backup/mongodb-$DATE

# Upload to S3
aws s3 cp /backup/mongodb-$DATE s3://your-bucket/backups/
```

**Airflow Database Backup**:
```bash
# PostgreSQL backup
docker exec cricket_postgres pg_dump \
  -U airflow airflow > airflow-backup-$(date +%Y%m%d).sql
```

## Disaster Recovery

### Recovery Procedures

1. **Database Recovery**:
```bash
# Restore MongoDB
docker exec -i cricket_mongodb mongorestore \
  --username admin \
  --password $MONGO_PASSWORD \
  /backup/path
```

2. **Model Recovery**:
- Models are stored in DagsHub MLFlow
- Automatically re-downloaded on startup

3. **Configuration Recovery**:
- Store .env in secure location
- Use secrets manager in production

## Scaling Guidelines

### Horizontal Scaling

**Flask App**:
```yaml
deploy:
  replicas: 3
  resources:
    limits:
      cpus: '1'
      memory: 2G
```

**Load Balancer**:
- Use Nginx, HAProxy, or cloud load balancer
- Distribute traffic across replicas
- Health check integration

### Vertical Scaling

**Resource Limits**:
```yaml
services:
  flask-app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

## Security Checklist

- [ ] Change default passwords
- [ ] Generate new secret keys
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Use secrets manager
- [ ] Enable authentication on all services
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Implement rate limiting
- [ ] Use private Docker registry

## Troubleshooting

### Common Issues

**Problem**: Model fails to load
**Solution**: 
- Verify DagsHub token
- Check model name and stage
- View logs: `docker-compose logs flask-app`

**Problem**: Airflow tasks fail
**Solution**:
- Check Airflow logs
- Verify network connectivity
- Ensure Flask app is running

**Problem**: Database connection errors
**Solution**:
- Verify MongoDB is running
- Check credentials
- Ensure network is configured

## Performance Optimization

### Caching

**Model Caching**:
- Cache loaded model in memory
- Use Redis for predictions cache

**Static Content**:
- Use CDN for static assets
- Enable browser caching

### Database Optimization

**MongoDB**:
- Create appropriate indexes
- Use aggregation pipeline
- Monitor slow queries

## Maintenance Windows

1. **Weekly**:
   - Review logs
   - Check disk space
   - Monitor performance

2. **Monthly**:
   - Update dependencies
   - Rotate logs
   - Review security

3. **Quarterly**:
   - Major updates
   - Performance optimization
   - Architecture review

## Support & Documentation

- GitHub Issues: Report bugs and feature requests
- Documentation: Keep architecture docs updated
- Runbooks: Document common procedures
- On-call: Set up rotation for production support
