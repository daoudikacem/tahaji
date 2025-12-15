@echo off
echo Starting Tahaji Application...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo Dependencies installed.
    echo.
)

REM Start the application with Electron
echo Starting the Tahaji application...
npm start

echo.
echo Application closed.
echo Press any key to exit...
pause >nul