# HomeBite Setup Script

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  HomeBite Development Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found! Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Backend Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Create virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database migrations completed" -ForegroundColor Green
} else {
    Write-Host "✗ Migration failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Frontend Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Install Node dependencies
if (Test-Path "frontend") {
    Set-Location frontend
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Node dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
} else {
    Write-Host "✗ Frontend directory not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start development:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend (Terminal 1):" -ForegroundColor Cyan
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python manage.py runserver" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (Terminal 2):" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend will be at: http://localhost:8000/api" -ForegroundColor Magenta
Write-Host "Frontend will be at: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
