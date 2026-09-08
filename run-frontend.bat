@echo off
title Smart Procurement - Vite React Frontend
cd /d "%~dp0frontend"
echo ========================================================
echo  Starting Vite Frontend (Port 5173)...
echo ========================================================
call npm run dev
pause
