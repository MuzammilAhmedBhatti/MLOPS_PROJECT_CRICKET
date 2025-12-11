# Cricket Shot Detection - Project Management Script
# Run this script to manage your MLOps project

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'status', 'clean', 'build', 'test', 'backup', 'help')]
    [string]$Action = 'help'
)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🏏 Cricket Shot Detection - MLOps Manager" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Cyan

function Show-Help {
    Write-Host "Available Commands:" -ForegroundColor Green
    Write-Host ""
    Write-Host "  start      - Start all services" -ForegroundColor White
    Write-Host "  stop       - Stop all services" -ForegroundColor White
    Write-Host "  restart    - Restart all services" -ForegroundColor White
    Write-Host "  logs       - View logs (Flask app)" -ForegroundColor White
    Write-Host "  status     - Check service status" -ForegroundColor White
    Write-Host "  clean      - Stop and remove all containers and volumes" -ForegroundColor White
    Write-Host "  build      - Rebuild and start services" -ForegroundColor White
    Write-Host "  test       - Test API endpoints" -ForegroundColor White
    Write-Host "  backup     - Backup MongoDB data" -ForegroundColor White
    Write-Host "  help       - Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage Examples:" -ForegroundColor Yellow
    Write-Host "  .\manage.ps1 start" -ForegroundColor Gray
    Write-Host "  .\manage.ps1 logs" -ForegroundColor Gray
    Write-Host "  .\manage.ps1 status" -ForegroundColor Gray
}

function Start-Services {
    Write-Host "🚀 Starting all services..." -ForegroundColor Green
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Services started successfully!" -ForegroundColor Green
        Write-Host "`nWaiting for services to initialize (30 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        Write-Host "`n📊 Service URLs:" -ForegroundColor Cyan
        Write-Host "  Flask App:  http://localhost:5000" -ForegroundColor White
        Write-Host "  Airflow:    http://localhost:8080 (airflow/airflow)" -ForegroundColor White
        Write-Host "  MongoDB:    mongodb://localhost:27017" -ForegroundColor White
        
        Show-Status
    } else {
        Write-Host "`n❌ Failed to start services" -ForegroundColor Red
    }
}

function Stop-Services {
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    docker-compose down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Services stopped successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Failed to stop services" -ForegroundColor Red
    }
}

function Restart-Services {
    Write-Host "🔄 Restarting all services..." -ForegroundColor Yellow
    Stop-Services
    Start-Sleep -Seconds 5
    Start-Services
}

function Show-Logs {
    Write-Host "📋 Showing Flask app logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    Write-Host ""
    docker-compose logs -f flask-app
}

function Show-Status {
    Write-Host "`n📊 Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n🔍 Testing endpoints..." -ForegroundColor Yellow
    
    # Test Flask app
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ Flask App: Online" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Flask App: Offline or starting..." -ForegroundColor Red
    }
    
    # Test Airflow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ Airflow: Online" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Airflow: Offline or starting..." -ForegroundColor Red
    }
}

function Clean-Environment {
    Write-Host "🧹 Cleaning environment..." -ForegroundColor Yellow
    Write-Host "⚠️  This will remove all containers and volumes!" -ForegroundColor Red
    
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -eq 'yes') {
        docker-compose down -v
        Write-Host "`n✅ Environment cleaned!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Cleaning cancelled" -ForegroundColor Yellow
    }
}

function Build-Services {
    Write-Host "🔨 Building and starting services..." -ForegroundColor Cyan
    docker-compose up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Services built and started successfully!" -ForegroundColor Green
        Start-Sleep -Seconds 30
        Show-Status
    } else {
        Write-Host "`n❌ Failed to build services" -ForegroundColor Red
    }
}

function Test-Endpoints {
    Write-Host "🧪 Testing API endpoints..." -ForegroundColor Cyan
    Write-Host ""
    
    # Test health endpoint
    Write-Host "Testing /health..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
        Write-Host "  Status: $($response.status)" -ForegroundColor Green
        Write-Host "  Model: $($response.model_status)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Test model info endpoint
    Write-Host "Testing /model-info..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/model-info" -Method Get
        Write-Host "  Status: $($response.status)" -ForegroundColor Green
        Write-Host "  Model Name: $($response.model_name)" -ForegroundColor Green
        Write-Host "  Classes: $($response.num_classes)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Test statistics endpoint
    Write-Host "Testing /statistics..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/statistics" -Method Get
        Write-Host "  Total Predictions: $($response.total_predictions)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Failed" -ForegroundColor Red
    }
}

function Backup-Database {
    Write-Host "💾 Creating MongoDB backup..." -ForegroundColor Cyan
    
    $backupDir = "backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "$backupDir\mongodb_$timestamp"
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    Write-Host "Backup location: $backupPath" -ForegroundColor Yellow
    
    docker exec cricket_mongodb mongodump --out /backup
    docker cp cricket_mongodb:/backup $backupPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Backup created successfully!" -ForegroundColor Green
        Write-Host "Location: $backupPath" -ForegroundColor White
    } else {
        Write-Host "`n❌ Backup failed" -ForegroundColor Red
    }
}

# Execute command
switch ($Action) {
    'start'   { Start-Services }
    'stop'    { Stop-Services }
    'restart' { Restart-Services }
    'logs'    { Show-Logs }
    'status'  { Show-Status }
    'clean'   { Clean-Environment }
    'build'   { Build-Services }
    'test'    { Test-Endpoints }
    'backup'  { Backup-Database }
    'help'    { Show-Help }
    default   { Show-Help }
}

Write-Host ""
