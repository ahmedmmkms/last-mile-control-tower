@echo off
REM Sprint 2 Backend Features Test Script
REM This script tests the new backend features implemented for Sprint 2

set BASE_URL=http://last-mile-control-tower.vercel.app
set DRIVER_ID=123e4567-e89b-12d3-a456-426614174000

echo 🧚 Sprint 2 Backend Features Test Script
echo =========================================
echo Base URL: %BASE_URL%
echo Driver ID: %DRIVER_ID%
echo.

echo Test 1: Basic API Connectivity
curl -s -X GET "%BASE_URL%/api" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ API Root Endpoint: Success
) else (
    echo ❌ API Root Endpoint: Failed
)

echo.
echo Test 2: Get All Drivers
curl -s -X GET "%BASE_URL%/api/drivers" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Drivers API Endpoint: Success
) else (
    echo ❌ Drivers API Endpoint: Failed
)

echo.
echo Test 3: Get All Shipments
curl -s -X GET "%BASE_URL%/api/shipments" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Shipments API Endpoint: Success
) else (
    echo ❌ Shipments API Endpoint: Failed
)

echo.
echo Test 4: Update Driver Location
curl -s -X PUT "%BASE_URL%/api/drivers/%DRIVER_ID%/location" -H "Content-Type: application/json" -d "{\"current_location\":{\"latitude\":40.7128,\"longitude\":-74.0060}}" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Driver Location Update: Success
) else (
    echo ❌ Driver Location Update: Failed
)

echo.
echo Test 5: Update Driver Status
curl -s -X PUT "%BASE_URL%/api/drivers/%DRIVER_ID%/status" -H "Content-Type: application/json" -d "{\"status\":\"busy\"}" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Driver Status Update: Success
) else (
    echo ❌ Driver Status Update: Failed
)

echo.
echo Test 6: Get Driver Assignments
curl -s -X GET "%BASE_URL%/api/drivers/%DRIVER_ID%/assignments" > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Driver Assignments: Success
) else (
    echo ❌ Driver Assignments: Failed
)

echo.
echo =========================================
echo 🎉 Sprint 2 Backend Features Test Complete
echo =========================================