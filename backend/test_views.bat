@echo off
echo Testing Video Views API...
echo.

echo Test 1: Track a view
curl -X POST http://localhost:5001/api/videos/1/view -H "Content-Type: application/json" -d "{\"watchDuration\":10}"
echo.
echo.

echo Test 2: Get views count
curl http://localhost:5001/api/videos/1/views
echo.
echo.

pause
