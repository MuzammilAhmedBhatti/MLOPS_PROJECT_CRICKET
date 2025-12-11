FROM python:3.10-slim

WORKDIR /app

# System dependencies for MediaPipe & OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    ffmpeg \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip first
RUN pip install --upgrade pip

# Copy requirements and install
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy Flask app
COPY . .

EXPOSE 5000
CMD ["python", "app.py"]