<div align="center">

# 🏏 Cricket Shot Detection
### Production-Ready MLOps Pipeline with Flask, Airflow & MLFlow

[![Python](https://img.shields.io/badge/Python-3.10-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![MLFlow](https://img.shields.io/badge/MLFlow-2.9-orange.svg)](https://mlflow.org/)
[![Airflow](https://img.shields.io/badge/Airflow-2.8-red.svg)](https://airflow.apache.org/)
[![DagsHub](https://img.shields.io/badge/DagsHub-MLOps-purple.svg)](https://dagshub.com/)

**An end-to-end MLOps solution for detecting cricket shots using deep learning** 🚀

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Demo](#-demo)

---

</div>

## 🎯 Overview

This project demonstrates a **complete MLOps pipeline** for cricket shot detection, integrating modern tools and best practices:

- 🎨 **Beautiful Web Interface** - Modern, responsive UI with real-time predictions
- 🤖 **MLFlow Integration** - Seamless model loading from DagsHub registry
- 🔄 **Automated Pipelines** - Airflow DAG for monitoring and orchestration
- 🐳 **Docker Containerization** - Easy deployment with Docker Compose
- 📊 **Data Persistence** - MongoDB for storing predictions and analytics
- 📈 **Real-time Monitoring** - Statistics dashboard and health checks

## ✨ Features

### 🌐 Web Application
- **Drag-and-drop image upload** for cricket shot images
- **Real-time predictions** with confidence scores
- **Interactive statistics dashboard** showing prediction distribution
- **Recent predictions history** with timestamps
- **Responsive design** optimized for all devices
- **Glassmorphism UI** with smooth animations

### 🤖 ML/AI Integration
- **MLFlow model registry** integration with DagsHub
- **Dynamic model loading** from Production/Staging stages
- **Model versioning** support for A/B testing
- **Automated model validation** in Airflow pipeline
- **Experiment tracking** with MLFlow

### 🔄 Automation & Monitoring
- **Airflow DAG** for daily pipeline execution
- **Health checks** for all services
- **Automated metrics logging** to MLFlow
- **Prediction monitoring** and statistics
- **Model performance tracking**

### 🗄️ Data Management
- **MongoDB** for scalable data storage
- **Prediction history** with full metadata
- **Analytics aggregation** for insights
- **Automatic backups** support
- **Query-optimized indexes**

## 🚀 Quick Start

### Prerequisites
```bash
# Check Docker installation
docker --version
docker-compose --version

# Minimum requirements:
# - Docker Desktop / Docker Engine
# - 4GB RAM available
# - 10GB disk space
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuzammilAhmedBhatti/cricket-shot-detection.git
   cd cricket-shot-detection
   ```

2. **Configure environment**
   ```bash
   # Edit .env file with your credentials
   notepad .env  # Windows
   nano .env     # Linux/Mac
   
   # Required: Update DAGSHUB_TOKEN with your token
   ```

3. **Start services**
   ```bash
   # Using management script (Windows)
   .\manage.ps1 start
   
   # Or using docker-compose directly
   docker-compose up -d
   ```

4. **Access applications**
   - **Flask App**: http://localhost:5000
   - **Airflow UI**: http://localhost:8080 (credentials: `airflow` / `airflow`)

### First Prediction

1. Open http://localhost:5000 in your browser
2. Click upload area or drag & drop a cricket shot image
3. Click **"Detect Cricket Shot"**
4. View prediction with confidence score! 🎉

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│                   (Web Browser - Port 5000)                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     FLASK APPLICATION                        │
│              • Image Upload & Processing                     │
│              • Model Inference (MLFlow)                      │
│              • REST API Endpoints                            │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   DagsHub    │    │   MongoDB    │    │   Airflow    │
│   MLFlow     │    │  Database    │    │  Pipeline    │
│ (Port 443)   │    │ (Port 27017) │    │ (Port 8080)  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │    Docker    │
                    │   Compose    │
                    └──────────────┘
```

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Python 3.10, Flask 3.0, Gunicorn |
| **ML/AI** | TensorFlow 2.15, Keras, MLFlow 2.9 |
| **ML Platform** | DagsHub, MLFlow Registry |
| **Orchestration** | Apache Airflow 2.8 |
| **Database** | MongoDB 7.0, PostgreSQL 15 |
| **Containerization** | Docker, Docker Compose |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | Step-by-step setup guide |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design and components |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production deployment guide |
| **[MODEL_UPDATE.md](MODEL_UPDATE.md)** | How to update models |
| **[EXAMPLES.md](EXAMPLES.md)** | Command examples and usage |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Complete project overview |

## 📊 Project Structure

```
cricket-shot-detection/
├── 📁 app/                    # Flask application
│   ├── app.py                 # Main application
│   ├── model_loader.py        # MLFlow integration
│   ├── utils.py               # Helper functions
│   ├── templates/             # HTML templates
│   └── Dockerfile             # Container definition
├── 📁 airflow/                # Airflow pipelines
│   └── dags/
│       └── cricket_pipeline.py
├── 📁 .github/                # CI/CD workflows
│   └── workflows/
│       └── ci-cd.yml
├── 📄 docker-compose.yml      # Service orchestration
├── 📄 .env                    # Environment config
└── 📖 Documentation files
```

## 🎬 Demo

### Web Interface
The application features a modern, dark-themed interface with:
- ✨ Smooth animations and transitions
- 📸 Drag-and-drop image upload
- 📊 Real-time statistics dashboard
- 📈 Prediction confidence visualization
- 🕒 Recent predictions history

### API Endpoints

```bash
# Health check
GET /health

# Model information
GET /model-info

# Make prediction
POST /predict
  - file: image file (multipart/form-data)

# Recent predictions
GET /recent-predictions?limit=10

# Statistics
GET /statistics
```

## 🔧 Management Commands

Use the PowerShell management script for easy operations:

```powershell
.\manage.ps1 start      # Start all services
.\manage.ps1 stop       # Stop all services
.\manage.ps1 restart    # Restart services
.\manage.ps1 logs       # View logs
.\manage.ps1 status     # Check health
.\manage.ps1 test       # Test endpoints
.\manage.ps1 backup     # Backup database
.\manage.ps1 clean      # Clean environment
```

## 🔄 Airflow Pipeline

The automated pipeline runs daily and:

1. ✅ Checks MLFlow connection to DagsHub
2. ✅ Validates model can be loaded
3. ✅ Monitors Flask app health
4. ✅ Collects prediction statistics
5. ✅ Logs metrics to MLFlow

Access Airflow UI at http://localhost:8080

## 🗄 Database Schema

**Predictions Collection** (MongoDB):

```javascript
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "image_name": String,
  "prediction": String,      // e.g., "Cover Drive"
  "confidence": Number,      // 0.0 to 1.0
  "model_version": String    // Model version used
}
```

## 🚀 Model Updates

When you train a new model in Colab:

1. Log model to DagsHub MLFlow
2. Register in model registry
3. Set to Production/Staging stage
4. Update `MODEL_STAGE` in `.env`
5. Restart Flask app

See [MODEL_UPDATE.md](MODEL_UPDATE.md) for detailed guide.

## 🔐 Security

- 🔒 Environment variables for sensitive data
- 🔑 MongoDB authentication enabled
- 🎫 Token-based MLFlow authentication
- 🔐 Flask secret key for sessions
- 🚫 `.env` excluded from Git

## 📈 Monitoring & Observability

- **Health Endpoints**: Real-time service status
- **Airflow Dashboard**: Pipeline monitoring
- **MLFlow Tracking**: Experiment and model metrics
- **MongoDB Analytics**: Prediction statistics
- **Docker Stats**: Resource usage monitoring

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Muzammil Ahmed Bhatti**

- DagsHub: [@MuzammilAhmedBhatti](https://dagshub.com/MuzammilAhmedBhatti)
- GitHub: [@MuzammilAhmedBhatti](https://github.com/MuzammilAhmedBhatti)

## 🙏 Acknowledgments

- **DagsHub** for MLFlow hosting and collaboration
- **Apache Airflow** community for workflow orchestration
- **Flask** team for the excellent web framework
- **TensorFlow** team for the ML framework

## 📞 Support

For issues and questions:
- 🐛 [Report a bug](https://github.com/MuzammilAhmedBhatti/cricket-shot-detection/issues)
- 💡 [Request a feature](https://github.com/MuzammilAhmedBhatti/cricket-shot-detection/issues)
- 📧 Contact: [Your email]

---

<div align="center">

**Made with ❤️ for the Cricket & ML Community**

⭐ Star this repo if you find it helpful!

[View on DagsHub](https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection) • [View Documentation](docs/) • [Report Bug](issues/)

</div>
