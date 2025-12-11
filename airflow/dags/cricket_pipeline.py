"""
Cricket Shot Detection MLOps Pipeline
Airflow DAG for monitoring and orchestrating the ML pipeline
"""
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
import os
import mlflow
import dagshub
import requests

# Default arguments
default_args = {
    'owner': 'MuzammilAhmedBhatti',
    'depends_on_past': False,
    'start_date': datetime(2025, 12, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# DAG definition
dag = DAG(
    'cricket_shot_detection_pipeline',
    default_args=default_args,
    description='MLOps pipeline for cricket shot detection',
    schedule_interval='@daily',
    catchup=False,
    tags=['mlops', 'cricket', 'computer-vision'],
)


def initialize_dagshub():
    """Initialize DagsHub connection"""
    try:
        dagshub_username = os.getenv('DAGSHUB_USERNAME')
        dagshub_repo = os.getenv('DAGSHUB_REPO')
        dagshub_token = os.getenv('DAGSHUB_TOKEN')
        mlflow_uri = os.getenv('MLFLOW_TRACKING_URI')
        
        print(f"🔗 Initializing DagsHub connection...")
        print(f"📊 Repository: {dagshub_username}/{dagshub_repo}")
        
        # Initialize DagsHub
        dagshub.init(
            repo_name=dagshub_repo,
            repo_owner=dagshub_username,
            mlflow=True
        )
        
        # Set MLFlow tracking URI
        mlflow.set_tracking_uri(mlflow_uri)
        
        # Set credentials
        os.environ['MLFLOW_TRACKING_USERNAME'] = dagshub_username
        os.environ['MLFLOW_TRACKING_PASSWORD'] = dagshub_token
        
        print("✅ DagsHub initialized successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing DagsHub: {str(e)}")
        raise


def check_mlflow_connection():
    """Verify MLFlow connection and model availability"""
    try:
        initialize_dagshub()
        
        model_name = os.getenv('MODEL_NAME', 'cricket_shot_detector')
        model_stage = os.getenv('MODEL_STAGE', 'Production')
        
        print(f"🔍 Checking for model: {model_name} (Stage: {model_stage})")
        
        # Get MLFlow client
        client = mlflow.tracking.MlflowClient()
        
        # Get model versions
        versions = client.get_latest_versions(model_name, stages=[model_stage])
        
        if not versions:
            raise Exception(f"No model found in {model_stage} stage")
        
        latest_version = versions[0]
        print(f"✅ Model found: Version {latest_version.version}")
        print(f"📅 Last updated: {latest_version.last_updated_timestamp}")
        print(f"🏷️ Run ID: {latest_version.run_id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking MLFlow connection: {str(e)}")
        raise


def validate_model():
    """Validate model can be loaded and is functional"""
    try:
        initialize_dagshub()
        
        model_name = os.getenv('MODEL_NAME', 'cricket_shot_detector')
        model_stage = os.getenv('MODEL_STAGE', 'Production')
        
        print(f"🔍 Loading model for validation...")
        model_uri = f"models:/{model_name}/{model_stage}"
        
        # Load model
        model = mlflow.keras.load_model(model_uri)
        
        print("✅ Model loaded successfully")
        print(f"📋 Model type: {type(model)}")
        
        # Get model summary if available
        if hasattr(model, 'summary'):
            print("\n📊 Model Summary:")
            model.summary()
        
        return True
        
    except Exception as e:
        print(f"❌ Error validating model: {str(e)}")
        raise


def check_flask_app():
    """Check if Flask app is running and healthy"""
    try:
        # Try to connect to Flask app
        flask_url = "http://flask-app:5000/health"
        
        print(f"🔍 Checking Flask app at {flask_url}")
        
        response = requests.get(flask_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Flask app is healthy")
            print(f"📊 Status: {data.get('status')}")
            print(f"🤖 Model status: {data.get('model_status')}")
            return True
        else:
            raise Exception(f"Flask app returned status code {response.status_code}")
        
    except Exception as e:
        print(f"⚠️ Warning: Could not check Flask app: {str(e)}")
        # Don't fail the entire pipeline if Flask app check fails
        return False


def monitor_predictions():
    """Monitor prediction statistics"""
    try:
        flask_url = "http://flask-app:5000/statistics"
        
        print(f"📊 Fetching prediction statistics...")
        
        response = requests.get(flask_url, timeout=10)
        
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Statistics retrieved successfully")
            print(f"📈 Total predictions: {stats.get('total_predictions', 0)}")
            
            distribution = stats.get('distribution', [])
            if distribution:
                print(f"\n📊 Prediction Distribution:")
                for item in distribution:
                    print(f"  - {item['_id']}: {item['count']}")
            
            return True
        else:
            raise Exception(f"Failed to get statistics: {response.status_code}")
        
    except Exception as e:
        print(f"⚠️ Warning: Could not monitor predictions: {str(e)}")
        return False


def log_pipeline_metrics():
    """Log pipeline execution metrics to MLFlow"""
    try:
        initialize_dagshub()
        
        with mlflow.start_run(run_name="pipeline_monitoring"):
            # Log pipeline execution
            mlflow.log_param("pipeline_date", datetime.now().isoformat())
            mlflow.log_param("pipeline_status", "success")
            
            # Try to get and log statistics
            try:
                flask_url = "http://flask-app:5000/statistics"
                response = requests.get(flask_url, timeout=10)
                if response.status_code == 200:
                    stats = response.json()
                    mlflow.log_metric("total_predictions", stats.get('total_predictions', 0))
            except:
                pass
            
            print("✅ Pipeline metrics logged to MLFlow")
        
        return True
        
    except Exception as e:
        print(f"⚠️ Warning: Could not log metrics: {str(e)}")
        return False


# Define tasks
start_pipeline = PythonOperator(
    task_id='start_pipeline',
    python_callable=lambda: print("🚀 Starting Cricket Shot Detection Pipeline"),
    dag=dag,
)

check_mlflow = PythonOperator(
    task_id='check_mlflow_connection',
    python_callable=lambda: print("Checking MLFlow connection..."),
    dag=dag,
)

validate_model_task = PythonOperator(
    task_id='validate_model',
    python_callable=lambda: print("Validating model..."),
    dag=dag,
)

check_flask = PythonOperator(
    task_id='check_flask_app',
    python_callable=lambda: print("Checking Flask app..."),
    dag=dag,
)

monitor_preds = PythonOperator(
    task_id='monitor_predictions',
    python_callable=lambda: print("Monitoring predictions..."),
    dag=dag,
)

log_metrics = PythonOperator(
    task_id='log_pipeline_metrics',
    python_callable=lambda: print("Logging pipeline metrics..."),
    dag=dag,
)

finish_pipeline = PythonOperator(
    task_id='finish_pipeline',
    python_callable=lambda: print("✅ Pipeline completed successfully"),
    dag=dag,
)

# Define task dependencies
start_pipeline >> check_mlflow >> validate_model_task >> check_flask >> monitor_preds >> log_metrics >> finish_pipeline
