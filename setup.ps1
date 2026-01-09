# StudentRank - Quick Start Script (Windows PowerShell)
# Run this after cloning the repository

Write-Host " StudentRank Setup Starting..." -ForegroundColor Cyan

# Backend Setup
Write-Host "`n Setting up Backend..." -ForegroundColor Yellow
Set-Location server

# Copy .env
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file - Please update DATABASE_URL and other credentials!" -ForegroundColor Green
}
else {
    Write-Host ".env already exists" -ForegroundColor Yellow
}

# Install backend dependencies
Write-Host "`Installing backend dependencies..." -ForegroundColor Yellow
npm install

# Prisma setup
Write-Host "`Setting up database..." -ForegroundColor Yellow
npx prisma generate
Write-Host "`IMPORTANT: Make sure PostgreSQL is running and .env DATABASE_URL is correct!" -ForegroundColor Yellow
Write-Host "Press Enter after updating .env to continue with database push..."
Read-Host

npx prisma db push

Write-Host "`nTIP: Run npx prisma studio to add colleges manually" -ForegroundColor Cyan


# Frontend Setup
Write-Host "`Setting up Frontend..." -ForegroundColor Yellow
Set-Location ../client

# Create .env.local
if (!(Test-Path ".env.local")) {
    "NEXT_PUBLIC_API_URL=http://localhost:5000" | Out-File -FilePath ".env.local"
    Write-Host "Created .env.local" -ForegroundColor Green
}
else {
    Write-Host ".env.local already exists" -ForegroundColor Yellow
}

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Set-Location ..

Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open TWO terminal windows" -ForegroundColor White
Write-Host "2. Terminal 1: cd server && npm run dev" -ForegroundColor White
Write-Host "3. Terminal 2: cd client && npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "5. Add colleges using Prisma Studio: cd server && npx prisma studio" -ForegroundColor White
Write-Host "Happy coding!" -ForegroundColor Cyan
