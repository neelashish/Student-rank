# Verification Script for Student Rank Deployment

Write-Host "`n=== Student Rank Deployment Verification ===" -ForegroundColor Cyan

# Check 1: Frontend .env.local
Write-Host "`n[1] Checking Frontend Environment..." -ForegroundColor Yellow
$envPath = "client\.env.local"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "https://student-rank-gfrv.onrender.com") {
        Write-Host "✅ Backend URL is correct in .env.local" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Backend URL is NOT set correctly" -ForegroundColor Red
        Write-Host "   Should be: NEXT_PUBLIC_API_URL=https://student-rank-gfrv.onrender.com" -ForegroundColor Yellow
    }
}
else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
}

# Check 2: Backend Status
Write-Host "`n[2] Checking Backend Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://student-rank-gfrv.onrender.com/health" -UseBasicParsing -TimeoutSec 60
    $healthData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Backend is LIVE" -ForegroundColor Green
    Write-Host "   Status: $($healthData.status)" -ForegroundColor Green
}
catch {
    Write-Host "⏳ Backend is waking up or unavailable..." -ForegroundColor Yellow
    Write-Host "   This is normal for free tier. Wait 30 seconds and try again." -ForegroundColor Yellow
}

# Check 3: Colleges API
Write-Host "`n[3] Checking Colleges API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://student-rank-gfrv.onrender.com/api/colleges" -UseBasicParsing -TimeoutSec 30
    $colleges = $response.Content | ConvertFrom-Json
    $count = ($colleges | Measure-Object).Count
    Write-Host "✅ Colleges API working" -ForegroundColor Green
    Write-Host "   Found $count colleges" -ForegroundColor Green
    Write-Host "   First 5 colleges:" -ForegroundColor Cyan
    $colleges | Select-Object -First 5 | ForEach-Object { 
        Write-Host "   - $($_.name) ($($_.city))" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Colleges API not responding" -ForegroundColor Red
    Write-Host "   Backend might still be waking up" -ForegroundColor Yellow
}

# Check 4: Frontend Dev Server
Write-Host "`n[4] Checking Frontend Dev Server..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "✅ Node.js process running" -ForegroundColor Green
    Write-Host "   Remember to restart if you changed .env.local!" -ForegroundColor Yellow
}
else {
    Write-Host "❌ No Node.js dev server running" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure .env.local has Render URL" -ForegroundColor White
Write-Host "2. Restart frontend: Ctrl+C, then 'npm run dev'" -ForegroundColor White
Write-Host "3. Wait 30 seconds for backend to wake up" -ForegroundColor White
Write-Host "4. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "`n"
