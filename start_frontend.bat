@echo off
title InvisibleScore Frontend (React + Vite)
echo ==============================================
echo  Starting InvisibleScore Frontend Dev Server...
echo ==============================================
cd /d "%~dp0frontend"
npm run dev -- --host 127.0.0.1 --port 5173
pause
