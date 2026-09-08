@echo off
echo ========================================================
echo  Launching Backend and Frontend in separate terminals...
echo ========================================================
start "Smart Procurement - Backend" cmd /c "%~dp0run-backend.bat"
start "Smart Procurement - Frontend" cmd /c "%~dp0run-frontend.bat"
