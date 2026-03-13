@echo off
echo Starting ODESHIE - African Fashion Store...
echo.
echo Starting backend server on port 5000...
start "ODESHIE Server" cmd /k "cd /d "%~dp0server" && node index.js"
timeout /t 2 /nobreak >nul
echo Starting frontend on port 5173...
start "ODESHIE Client" cmd /k "cd /d "%~dp0client" && npm run dev"
echo.
echo Both servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173
