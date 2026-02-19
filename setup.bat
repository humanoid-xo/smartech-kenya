@echo off
REM Smartech Kenya - Windows Setup Script

echo ====================================
echo Smartech Kenya Setup Script
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [OK] npm detected:
npm --version
echo.

REM Install dependencies
echo [STEP] Installing dependencies...
echo This may take 2-5 minutes...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    echo Try: npm cache clean --force and then run this script again
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Check if .env exists
if not exist .env (
    echo [WARN] No .env file found
    echo [STEP] Creating .env from .env.example...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo [IMPORTANT] Please edit .env and add your actual credentials:
    echo   - DATABASE_URL (MongoDB connection string)
    echo   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
    echo   - M-Pesa credentials
    echo   - Cloudinary credentials
    echo   - Twilio credentials (optional)
    echo   - Email SMTP settings (optional)
    echo.
    echo Opening .env file in Notepad...
    start notepad .env
    echo.
    pause
) else (
    echo [OK] .env file exists
)

echo.

REM Generate Prisma client
echo [STEP] Generating Prisma client...
call npx prisma generate

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)

echo [OK] Prisma client generated
echo.

REM Ask about database push
set /p PUSH_DB="Do you want to push the database schema to MongoDB? (y/n): "
if /i "%PUSH_DB%"=="y" (
    echo [STEP] Pushing database schema...
    call npx prisma db push
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to push database schema
        echo Please check your DATABASE_URL in .env
        echo Make sure MongoDB Atlas allows connections from your IP (0.0.0.0/0)
        pause
        exit /b 1
    )
    
    echo [OK] Database schema pushed successfully
) else (
    echo [SKIP] Skipping database push
)

echo.
echo ====================================
echo Setup completed successfully!
echo ====================================
echo.
echo Next steps:
echo 1. Review and update .env file with your credentials
echo 2. Run 'npm run dev' to start development server
echo 3. Visit http://localhost:3000
echo.
echo Documentation:
echo - README.md - Project overview
echo - STEP_BY_STEP_MANUAL.md - Detailed setup guide
echo - BUG_FIXES.md - Recent fixes applied
echo.
echo For deployment instructions, see DEPLOYMENT_CHECKLIST.md
echo.
echo Happy coding!
echo.
pause
