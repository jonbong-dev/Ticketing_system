@echo off
REM JEB Ticketing System - Cloudflare Pages Deployment Script (Windows)

echo.
echo 🚀 JEB Ticketing System - Cloudflare Deployment
echo ================================================
echo.

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Wrangler CLI not found. Installing...
    call npm install -g wrangler
)

REM Check if logged in
echo 🔐 Checking Cloudflare authentication...
call wrangler whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Cloudflare...
    call wrangler login
)

REM Build the project
echo.
echo 🔨 Building project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Deploy to Cloudflare Pages
echo 📤 Deploying to Cloudflare Pages...
echo    Project: jeb-ticketing-system
echo    Directory: dist/
echo.

call wrangler pages deploy dist --project-name=jeb-ticketing-system

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo 🌐 Your site is live at: https://jeb-ticketing-system.pages.dev
    echo.
) else (
    echo.
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

pause
