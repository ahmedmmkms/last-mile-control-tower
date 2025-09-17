# Test-LastMileAPI.ps1
# PowerShell script to test the Last-Mile Delivery Control Tower API on Vercel

# Configuration
$DEPLOYED_URL = "http://last-mile-control-tower.vercel.app"
$API_BASE_URL = "$DEPLOYED_URL/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Last-Mile Delivery Control Tower API Test" -ForegroundColor Cyan
Write-Host "Testing deployment at: $DEPLOYED_URL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Initialize test results
$TotalTests = 0
$PassedTests = 0
$FailedTests = 0

# Function to run a test
function Run-Test {
    param(
        [string]$TestName,
        [scriptblock]$TestBlock
    )
    
    $TotalTests++
    try {
        & $TestBlock
        $script:PassedTests++
        Write-Host "✅ $TestName" -ForegroundColor Green
    }
    catch {
        $script:FailedTests++
        Write-Host "❌ $TestName" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 1: API Root Endpoint
Run-Test "API Root Endpoint" {
    $response = Invoke-RestMethod -Uri "$DEPLOYED_URL/api" -Method Get
    if ($response.message -ne "Last-Mile Delivery Control Tower API") {
        throw "API root endpoint returned unexpected response"
    }
}

# Test 2: Get All Drivers
Run-Test "Get All Drivers" {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/drivers" -Method Get
    if ($response.GetType().Name -ne "Object[]") {
        throw "Drivers endpoint did not return an array"
    }
    Write-Host "   Found $($response.Length) drivers" -ForegroundColor Gray
}

# Test 3: Get All Shipments
Run-Test "Get All Shipments" {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    if ($response.GetType().Name -ne "Object[]") {
        throw "Shipments endpoint did not return an array"
    }
    Write-Host "   Found $($response.Length) shipments" -ForegroundColor Gray
}

# Test 4: Get All Routes
Run-Test "Get All Routes" {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/routes" -Method Get
    if ($response.GetType().Name -ne "Object[]") {
        throw "Routes endpoint did not return an array"
    }
    Write-Host "   Found $($response.Length) routes" -ForegroundColor Gray
}

# Test 5: Get Specific Driver
Run-Test "Get Specific Driver" {
    # First get all drivers to find an existing ID
    $drivers = Invoke-RestMethod -Uri "$API_BASE_URL/drivers" -Method Get
    if ($drivers.Length -gt 0) {
        $driverId = $drivers[0].id
        $response = Invoke-RestMethod -Uri "$API_BASE_URL/drivers/$driverId" -Method Get
        if ($response.id -ne $driverId) {
            throw "Retrieved driver ID does not match requested ID"
        }
        Write-Host "   Retrieved driver: $($response.name)" -ForegroundColor Gray
    } else {
        throw "No drivers found in database"
    }
}

# Test 6: Get Specific Shipment
Run-Test "Get Specific Shipment" {
    # First get all shipments to find an existing ID
    $shipments = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    if ($shipments.Length -gt 0) {
        $shipmentId = $shipments[0].id
        $response = Invoke-RestMethod -Uri "$API_BASE_URL/shipments/$shipmentId" -Method Get
        if ($response.id -ne $shipmentId) {
            throw "Retrieved shipment ID does not match requested ID"
        }
        Write-Host "   Retrieved shipment: $($response.tracking_number)" -ForegroundColor Gray
    } else {
        throw "No shipments found in database"
    }
}

# Test 7: Get Specific Route
Run-Test "Get Specific Route" {
    # First get all routes to find an existing ID
    $routes = Invoke-RestMethod -Uri "$API_BASE_URL/routes" -Method Get
    if ($routes.Length -gt 0) {
        $routeId = $routes[0].id
        $response = Invoke-RestMethod -Uri "$API_BASE_URL/routes/$routeId" -Method Get
        if ($response.id -ne $routeId) {
            throw "Retrieved route ID does not match requested ID"
        }
        Write-Host "   Retrieved route for shipment: $($response.shipment_id)" -ForegroundColor Gray
    } else {
        throw "No routes found in database"
    }
}

# Display test results
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total tests: $TotalTests" -ForegroundColor White
Write-Host "Passed: $PassedTests" -ForegroundColor Green
Write-Host "Failed: $FailedTests" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

if ($FailedTests -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ $FailedTests test(s) failed" -ForegroundColor Red
    exit 1
}