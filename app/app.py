""" Cricket Shot Detection - All-in-one Flask App
Dynamic MLflow loading: finds latest run automatically.
This version is corrected to reliably find and load the artifact at:
artifacts/model_files/cricket_shot_model.keras
"""
import os
import traceback
import numpy as np
from flask import Flask, request, jsonify, render_template_string, render_template
from werkzeug.utils import secure_filename
from PIL import Image
import mlflow
import tempfile
import tensorflow as tf
from mlflow import MlflowClient


# ---- App config ------------------------------------------------------------
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = '/app/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ============================================
# MLflow Credentials (hardcoded for simplicity)
# ============================================
# NOTE: keep these secure in real deployments (use environment or secret manager)
MLFLOW_TRACKING_URI = "https://dagshub.com/MuzammilAhmedBhatti/cricket-shot-detection.mlflow"
MLFLOW_USERNAME = "MuzammilAhmedBhatti"
MLFLOW_PASSWORD = "10ca6de9789b8127b0d13c90d48ba4ece0e657a7"

# ---- Debug helper ----------------------------------------------------------
log_debug_called = False
def log_debug(msg):
    """Debug logging (prints + flush)."""
    global log_debug_called
    log_debug_called = True
    try:
        # Use both for maximum visibility
        print(f"[DEBUG] {msg}", flush=True)
    except Exception:
        try:
            print(f"[DEBUG] (fallback) {msg}")
        except Exception:
            pass

# ---- Export credentials & set tracking URI --------------------------------
print("DEBUG: Setting MLflow environment variables...")
log_debug("Exporting MLflow username and (masked) password to env")
os.environ['MLFLOW_TRACKING_USERNAME'] = MLFLOW_USERNAME
os.environ['MLFLOW_TRACKING_PASSWORD'] = MLFLOW_PASSWORD

# Defensive: strip hidden/unicode characters from URI
clean_uri = MLFLOW_TRACKING_URI.strip()
if clean_uri != MLFLOW_TRACKING_URI:
    log_debug("MLFLOW_TRACKING_URI contained leading/trailing whitespace — cleaned it.")
MLFLOW_TRACKING_URI = clean_uri

print(f"DEBUG: Setting MLflow tracking URI to {MLFLOW_TRACKING_URI}")
log_debug(f"Setting MLFLOW_TRACKING_URI: {MLFLOW_TRACKING_URI}")
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)

# ============================================
# Globals
# ============================================
model = None
class_names = ["pullshot", "sweep", "legglance-flick", "drive"]

print("=" * 60)
print("🏏 Cricket Shot Detection App")
print("=" * 60)

# ----------------- MLflow helpers ------------------------------------------------
def get_latest_run_id():
    """Find the latest MLflow run (most recent start_time)."""
    log_debug("get_latest_run_id: entered function")
    print("DEBUG: Searching MLflow for latest runs (mlflow.search_runs)...")
    try:
        runs = mlflow.search_runs(order_by=["start_time DESC"])
        log_debug("get_latest_run_id: mlflow.search_runs returned")
        if runs is None or runs.empty:
            log_debug("get_latest_run_id: no runs found (runs.empty)")
            raise Exception("No runs found in MLFlow")
        latest_run = runs.iloc[0]
        run_id = latest_run.run_id
        log_debug(f"Found latest run_id: {run_id}")
        print(f"DEBUG: Latest run id found: {run_id}")
        return run_id
    except Exception as e:
        log_debug(f"Error finding latest run: {e}")
        print(f"DEBUG: get_latest_run_id error: {e}")
        traceback.print_exc()
        raise

def load_model_from_registry():
    """Attempt to load model via Model Registry (pyfunc)."""
    log_debug("load_model_from_registry: entered function")
    try:
        model_name = "cricket_shot_detector"
        model_version = "3"  # change if necessary
        log_debug(f"Attempting to load from registry: {model_name} / version {model_version}")
        print(f"DEBUG: Loading model from registry: models:/{model_name}/{model_version}")

        model_uri = f"models:/{model_name}/{model_version}"
        loaded = mlflow.pyfunc.load_model(model_uri)
        log_debug("load_model_from_registry: model loaded via mlflow.pyfunc.load_model")
        print("DEBUG: ✅ Model loaded successfully from registry.")
        return loaded
    except Exception as e:
        log_debug(f"Error loading from registry: {e}")
        print(f"DEBUG: load_model_from_registry exception: {e}")
        traceback.print_exc()
        raise

def download_model_from_artifacts():
    """
    Automatically finds the latest run's artifacts,
    downloads them, and loads a model file (.keras, .h5, or .tf)
    with TensorFlow.
    """
    try:
        log_debug("download_model_from_artifacts: entered function")

        # Get the latest run ID
        run_id = get_latest_run_id()
        log_debug(f"Latest run ID = {run_id}")
        print(f"DEBUG: Using latest run ID: {run_id}")

        # Download ALL artifacts from the run
        print("DEBUG: Downloading all artifacts from run...")
        with tempfile.TemporaryDirectory() as tmp_dir:
            print(f"DEBUG: Downloading to temp directory {tmp_dir}")
            
            # Download all artifacts (empty artifact_path means root)
            artifacts_path = mlflow.artifacts.download_artifacts(
                run_id=run_id,
                artifact_path="",  # Empty string means download everything
                dst_path=tmp_dir
            )
            
            print(f"DEBUG: All artifacts downloaded to: {artifacts_path}")
            log_debug(f"Downloaded all artifacts to: {artifacts_path}")

            # Recursively search for model files
            model_path = None
            print("DEBUG: Searching for model files (.keras, .h5, .tf)...")
            
            for root, dirs, files in os.walk(artifacts_path):
                for file in files:
                    # Check for multiple file extensions
                    if file.endswith('.keras') or file.endswith('.h5') or file.endswith('.tf'):
                        model_path = os.path.join(root, file)
                        print(f"DEBUG: Found model file: {model_path}")
                        log_debug(f"Found model: {model_path}")
                        break
                if model_path:
                    break
            
            if not model_path:
                raise FileNotFoundError("No model file (.keras/.h5/.tf) found in artifacts")
            
            # Load the model
            print(f"DEBUG: Loading model from {model_path}")
            model_loaded = tf.keras.models.load_model(model_path)
            
            print("DEBUG: Model loaded successfully!")
            log_debug("Keras model loaded successfully")
            
            return model_loaded

    except Exception as e:
        log_debug(f"download_model_from_artifacts ERROR: {e}")
        traceback.print_exc()
        raise



def load_model():
    """Load model using Model Registry first, then run artifacts fallback."""
    global model
    log_debug("load_model: entered function")
    try:
        print("\n📦 Loading model from MLflow...")
        log_debug("load_model: trying Model Registry first")
        try:
            log_debug("Attempting to load from Model Registry...")
            model = load_model_from_registry()
            log_debug(f"Model loaded from registry, type: {type(model)}")
            print(f"🎯 Model type: {type(model)}")
            return True
        except Exception as registry_error:
            log_debug(f"Registry loading failed: {registry_error}")
            print(f"DEBUG: Registry loading failed: {registry_error}")
            traceback.print_exc()
            log_debug("Falling back to loading from run artifacts...")
            print("DEBUG: Falling back to artifacts download and loading")

            # Fall back to loading from run artifacts
            model = download_model_from_artifacts()
            log_debug(f"Model loaded from artifacts, type: {type(model)}")
            print(f"🎯 Model type: {type(model)}")
            return True

    except Exception as e:
        print(f"❌ Failed to load model: {str(e)}")
        log_debug(f"load_model: failed with exception: {e}")
        traceback.print_exc()
        return False

# ============================================
# Flask Routes
# ============================================

@app.route('/health')
def health():
    """Health check"""
    log_debug("health: endpoint called")
    print("DEBUG: /health requested")
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    log_debug("predict: endpoint called")
    print("DEBUG: /predict called")
    try:
        if model is None:
            log_debug("predict: model is None -> returning 500")
            print("DEBUG: Model not loaded at predict time")
            return jsonify({'error': 'Model not loaded'}), 500

        if 'file' not in request.files:
            log_debug("predict: no file in request.files")
            print("DEBUG: No file found in request.files")
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            log_debug("predict: empty filename in uploaded file")
            print("DEBUG: Uploaded file has empty filename")
            return jsonify({'error': 'No file selected'}), 400

        # Save and process image
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        log_debug(f"predict: saving uploaded file to {filepath}")
        print(f"DEBUG: Saving uploaded file to {filepath}")
        file.save(filepath)
        log_debug("predict: file saved to disk")

        # Preprocess
        log_debug("predict: opening image and preprocessing")
        print("DEBUG: Starting image preprocessing")
        img = Image.open(filepath).convert('RGB')
        log_debug("predict: image converted to RGB")
        img = img.resize((224, 224))
        log_debug("predict: image resized to (224,224)")
        img_array = np.array(img)
        log_debug(f"predict: image converted to numpy array with shape {img_array.shape}")
        img_array = np.expand_dims(img_array, axis=0)
        log_debug(f"predict: image array expanded to shape {img_array.shape}")

        # Predict
        log_debug(f"Making prediction for: {filename}")
        print(f"DEBUG: Calling model.predict for file {filename}")
        # If the loaded model is an mlflow pyfunc wrapper it expects different input; but we loaded a Keras model
        predictions = model.predict(img_array, verbose=0)[0]
        log_debug(f"predict: raw predictions: {predictions}")
        predicted_idx = int(np.argmax(predictions))
        confidence = float(predictions[predicted_idx] * 100)
        predicted_class = class_names[predicted_idx]

        # Clean up
        try:
            os.remove(filepath)
            log_debug(f"predict: removed temporary file {filepath}")
            print(f"DEBUG: Removed uploaded file {filepath}")
        except Exception as cleanup_err:
            log_debug(f"predict: failed to remove file {filepath}: {cleanup_err}")
            print(f"DEBUG: Failed to remove file {filepath}: {cleanup_err}")

        log_debug(f"🎯 Prediction: {predicted_class} ({confidence:.2f}%)")
        print(f"DEBUG: Prediction result - {predicted_class} with confidence {confidence:.2f}%")

        return jsonify({
            'prediction': predicted_class,
            'confidence': round(confidence, 2)
        })

    except Exception as e:
        log_debug(f"❌ Prediction error: {str(e)}")
        print(f"DEBUG: predict exception: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ---------------- Home page HTML (unchanged) ----------------------------------
HOME_HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>Cricket Shot Detection</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
             background: white;
             padding: 40px;
             border-radius: 20px;
             box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
        }
        h1 {
             color: #333;
             text-align: center;
             margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .upload-form {
             margin: 30px 0;
             padding: 40px;
             border: 3px dashed #667eea;
             border-radius: 15px;
             text-align: center;
            background: #f8f9ff;
            transition: all 0.3s;
        }
        .upload-form:hover {
            border-color: #764ba2;
            background: #f0f1ff;
        }
        input[type="file"] {
             margin: 20px 0;
            padding: 10px;
        }
        button {
             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
             padding: 15px 40px;
             border: none;
             border-radius: 50px;
             cursor: pointer;
             font-size: 18px;
            font-weight: bold;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        button:hover {
             transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        button:active {
            transform: translateY(0);
        }
        #result {
             margin-top: 30px;
             padding: 25px;
             background: #f0fdf4;
             border-radius: 10px;
             display: none;
            border-left: 4px solid #10b981;
        }
        .prediction {
             font-size: 28px;
             font-weight: bold;
             color: #059669;
             margin: 10px 0;
            text-transform: capitalize;
        }
        .confidence {
             font-size: 20px;
             color: #666;
        }
        .loading {
             color: #f59e0b;
             font-size: 18px;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .error {
            background: #fef2f2 !important;
            border-left-color: #ef4444 !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏏 Cricket Shot Detection</h1>
        <p class="subtitle">AI-Powered Shot Classification</p>

        <div class="upload-form">
            <h3>Upload Cricket Shot Image</h3>
            <p style="color: #888; font-size: 14px; margin: 10px 0;">Supported: pullshot, sweep, legglance-flick, drive</p>
            <input type="file" id="fileInput" accept="image/*">
            <br>
            <button onclick="uploadImage()">🎯 Detect Shot</button>
        </div>

        <div id="result"></div>
    </div>

    <script>
        function uploadImage() {
            const fileInput = document.getElementById('fileInput');
            const resultDiv = document.getElementById('result');

            if (!fileInput.files[0]) {
                alert('Please select an image first');
                return;
            }

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            resultDiv.style.display = 'block';
            resultDiv.className = '';
            resultDiv.innerHTML = '<p class="loading">⏳ Analyzing shot...</p>';

            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.className = 'error';
                    resultDiv.innerHTML = `<p style="color: #dc2626;">❌ Error: ${data.error}</p>`;
                } else {
                    resultDiv.innerHTML = `
                        <h3 style="color: #059669; margin-bottom: 15px;">✅ Shot Detected!</h3>
                        <p class="prediction">${data.prediction.replace('-', ' ')}</p>
                        <p class="confidence">Confidence: ${data.confidence}%</p>
                    `;
                }
            })
            .catch(error => {
                resultDiv.className = 'error';
                resultDiv.innerHTML = `<p style="color: #dc2626;">❌ Error: ${error}</p>`;
            });
        }

        // Allow drag and drop
        const uploadForm = document.querySelector('.upload-form');
        uploadForm.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadForm.style.borderColor = '#764ba2';
            uploadForm.style.background = '#f0f1ff';
        });

        uploadForm.addEventListener('dragleave', () => {
            uploadForm.style.borderColor = '#667eea';
            uploadForm.style.background = '#f8f9ff';
        });

        uploadForm.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadForm.style.borderColor = '#667eea';
            uploadForm.style.background = '#f8f9ff';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                document.getElementById('fileInput').files = files;
            }
        });
    </script>
</body>
</html>
'''

@app.route('/')
def home():
    """Landing page"""
    log_debug("home: rendering landing page")
    print("DEBUG: / (home) requested")
    return render_template('landing.html')

@app.route('/dashboard')
def dashboard():
    """Cricket dashboard page"""
    log_debug("dashboard: rendering dashboard page")
    print("DEBUG: /dashboard requested")
    return render_template('dashboard.html')

@app.route('/quiz')
def quiz():
    """Cricket quiz page"""
    log_debug("quiz: rendering quiz page")
    print("DEBUG: /quiz requested")
    return render_template('quiz.html')

@app.route('/games')
def games():
    """Cricket games page"""
    log_debug("games: rendering games page")
    print("DEBUG: /games requested")
    return render_template('games.html')

@app.route('/predict')
def predict_page():
    """ML prediction page (original)"""
    log_debug("predict_page: rendering prediction page")
    print("DEBUG: /predict (page) requested")
    return render_template_string(HOME_HTML)

# ============================================
# Startup
# ============================================
log_debug("=" * 60)
log_debug("🏏 Cricket Shot Detection - Initializing")
log_debug("=" * 60)
log_debug(f"MLFlow URI: {MLFLOW_TRACKING_URI}")
log_debug(f"Username: {MLFLOW_USERNAME}")
print("\n🔄 Loading model from MLflow...")
model_loaded = load_model()

if model_loaded:
    print("\n✅ All systems ready!")
    print("🌐 Server: http://localhost:5000")
    print("=" * 60)
    log_debug("Startup: model loaded successfully, ready to serve requests")
else:
    print("\n⚠️  Model loading failed")
    print("=" * 60)
    log_debug("Startup: model failed to load; server will still run but /predict will return model not loaded")

if __name__ == '__main__':
    log_debug("Starting Flask app via app.run")
    print("DEBUG: Calling app.run(host='0.0.0.0', port=5000)")
    app.run(host='0.0.0.0', port=5000)
