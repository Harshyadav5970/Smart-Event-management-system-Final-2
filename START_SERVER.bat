@echo off
title EventHub - Smart College Event & Fest Management System (Harsh Yadav - Roll 129)
color 0B

echo =======================================================================
echo          EventHub - Smart College Event & Fest Management System
echo                  Author: Harsh Yadav (TYCS Roll 129)
echo =======================================================================
echo.

echo [*] Starting EventHub Backend API Server on Port 5000...
cd /d "%~dp0backend"
start "EventHub Backend API (Port 5000)" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo [*] Starting EventHub Frontend React Server on Port 5173...
cd /d "%~dp0frontend"
start "EventHub Frontend (Port 5173)" cmd /k "npm run dev"

timeout /t 2 /nobreak >nul

echo [*] Opening EventHub in your default web browser...
start http://localhost:5173

echo.
echo =======================================================================
echo [OK] EventHub is running!
echo      - Frontend UI:  http://localhost:5173
echo      - Backend API:  http://localhost:5000/api/health
echo =======================================================================
echo.
pause
