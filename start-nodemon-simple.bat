@echo off
echo Starting Liquid Kourage Website with Nodemon...
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Features:
echo - Auto-restart when files change
echo - Auto-restart if server crashes
echo - Watching HTML, CSS, JS, and image files
echo.
echo Press Ctrl+C to stop the server
echo.

set PATH=C:\Program Files\nodejs;%PATH%
npm run dev

pause 