@echo off
title Smart Procurement - Spring Boot Backend
cd /d "%~dp0backend\smart-procurement-system-backend"
echo ========================================================
echo  Starting Spring Boot Backend (Port 8080)...
echo ========================================================
call mvnw.cmd spring-boot:run
pause
