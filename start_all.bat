@echo off
title InvisibleScore Platform Launcher
echo =========================================================
echo  Launching InvisibleScore (Backend + Frontend)
echo =========================================================
echo.

start "InvisibleScore Backend" cmd /k "%~dp0start_backend.bat"
start "InvisibleScore Frontend" cmd /k "%~dp0start_frontend.bat"

echo.
echo Both servers are launching in dedicated terminal windows!
echo - Backend:  http://127.0.0.1:8000 (Swagger docs at /docs)
echo - Frontend: http://127.0.0.1:5173
echo.
timeout /t 3 >nul
start http://127.0.0.1:5173/
