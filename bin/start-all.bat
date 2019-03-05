@echo OFF

echo STARTING DB
start "GREM-API-DEV: MONGOD" cmd /c start-db.bat

timeout /t 1 /nobreak>nul

echo.
echo STARTING APP
start "GREM-API-DEV: APP" cmd /c start-app.bat
