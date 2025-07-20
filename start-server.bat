@echo off
echo Starting Liquid Kourage Entertainment Website Server...
echo.
echo The website will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
powershell -ExecutionPolicy Bypass -File "start-server.ps1"
pause 