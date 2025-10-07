@echo off
echo Starting NT Event Finder Frontend...
echo.
echo Please choose an option:
echo 1. Open with default browser (file://)
echo 2. Start Python HTTP Server (port 3000)
echo 3. Start Node.js HTTP Server (port 3000)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Opening with default browser...
    start "" "Frontend\index.html"
) else if "%choice%"=="2" (
    echo Starting Python HTTP Server on port 3000...
    cd Frontend
    python -m http.server 3000
) else if "%choice%"=="3" (
    echo Starting Node.js HTTP Server on port 3000...
    cd Frontend
    npx http-server -p 3000
) else (
    echo Invalid choice. Opening with default browser...
    start "" "Frontend\index.html"
)

pause
