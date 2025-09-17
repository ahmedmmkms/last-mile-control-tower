@echo off
REM Test-LastMileAPI.bat
REM Batch script to test the Last-Mile Delivery Control Tower API on Vercel

set DEPLOYED_URL=http://last-mile-control-tower.vercel.app
set API_BASE_URL=%DEPLOYED_URL%/api

echo ========================================
echo Last-Mile Delivery Control Tower API Test 
echo Testing deployment at: %DEPLOYED_URL%
echo ========================================

echo.
echo 1. Testing API Root Endpoint...
curl -s %DEPLOYED_URL%/api | findstr "Last-Mile" >nul
if %errorlevel% == 0 (
    echo ✅ API Root Endpoint: PASSED
) else (
    echo ❌ API Root Endpoint: FAILED
)

echo.
echo 2. Testing Drivers Endpoint...
curl -s %API_BASE_URL%/drivers | findstr "\[" >nul
if %errorlevel% == 0 (
    echo ✅ Drivers Endpoint: PASSED
) else (
    echo ❌ Drivers Endpoint: FAILED
)

echo.
echo 3. Testing Shipments Endpoint...
curl -s %API_BASE_URL%/shipments | findstr "\[" >nul
if %errorlevel% == 0 (
    echo ✅ Shipments Endpoint: PASSED
) else (
    echo ❌ Shipments Endpoint: FAILED
)

echo.
echo 4. Testing Routes Endpoint...
curl -s %API_BASE_URL%/routes | findstr "\[" >nul
if %errorlevel% == 0 (
    echo ✅ Routes Endpoint: PASSED
) else (
    echo ❌ Routes Endpoint: FAILED
)

echo.
echo ========================================
echo Test completed!
echo ========================================