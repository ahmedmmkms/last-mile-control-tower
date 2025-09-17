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

# Test 8: POST New Driver
Run-Test "POST New Driver" {
    $newDriver = @{
        name = "Test Driver $(Get-Random)"
        phone = "+1234567890"
        vehicle_type = "car"
        status = "available"
        current_location = @{
            lat = 40.7128
            lng = -74.0060
        }
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE_URL/drivers" -Method Post -Body ($newDriver | ConvertTo-Json) -ContentType "application/json"
        if (-not $response.id) {
            throw "Created driver does not have an ID"
        }
        Write-Host "   Created driver with ID: $($response.id)" -ForegroundColor Gray
        # Store the created driver ID for later tests
        $script:createdDriverId = $response.id
    }
    catch {
        # Handle the case where POST might fail on Vercel due to serverless limitations
        Write-Host "   Note: POST operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
        throw $_.Exception.Message
    }
}

# Test 9: PUT Update Driver
Run-Test "PUT Update Driver" {
    if ($script:createdDriverId) {
        $updatedDriver = @{
            name = "Updated Test Driver $(Get-Random)"
            phone = "+0987654321"
            vehicle_type = "bike"
            status = "busy"
            current_location = @{
                lat = 40.7589
                lng = -73.9851
            }
        }
        
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/drivers/$($script:createdDriverId)" -Method Put -Body ($updatedDriver | ConvertTo-Json) -ContentType "application/json"
            if ($response.name -ne $updatedDriver.name) {
                throw "Driver was not updated correctly"
            }
            Write-Host "   Updated driver: $($response.name)" -ForegroundColor Gray
        }
        catch {
            # Handle the case where PUT might fail on Vercel due to serverless limitations
            Write-Host "   Note: PUT operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        Write-Host "   Skipping PUT test - no driver created" -ForegroundColor Yellow
        throw "No driver ID available for updating"
    }
}

# Test 10: POST New Shipment
Run-Test "POST New Shipment" {
    $newShipment = @{
        tracking_number = "TRK-TEST-$(Get-Random)"
        status = "pending"
        origin = @{
            address = "123 Test St, New York, NY"
            lat = 40.7128
            lng = -74.0060
        }
        destination = @{
            address = "456 Test Ave, New York, NY"
            lat = 40.7589
            lng = -73.9851
        }
        assigned_driver_id = $null
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Post -Body ($newShipment | ConvertTo-Json) -ContentType "application/json"
        if (-not $response.id) {
            throw "Created shipment does not have an ID"
        }
        Write-Host "   Created shipment with ID: $($response.id)" -ForegroundColor Gray
        # Store the created shipment ID for later tests
        $script:createdShipmentId = $response.id
    }
    catch {
        # Handle the case where POST might fail on Vercel due to serverless limitations
        Write-Host "   Note: POST operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
        throw $_.Exception.Message
    }
}

# Test 11: PUT Update Shipment
Run-Test "PUT Update Shipment" {
    if ($script:createdShipmentId) {
        # Get the current shipment to preserve the tracking number
        $currentShipment = Invoke-RestMethod -Uri "$API_BASE_URL/shipments/$($script:createdShipmentId)" -Method Get
        
        $updatedShipment = @{
            tracking_number = $currentShipment.tracking_number  # Keep the same tracking number
            status = "assigned"
            origin = @{
                address = "123 Updated St, New York, NY"
                lat = 40.7128
                lng = -74.0060
            }
            destination = @{
                address = "456 Updated Ave, New York, NY"
                lat = 40.7589
                lng = -73.9851
            }
            assigned_driver_id = $null
        }
        
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/shipments/$($script:createdShipmentId)" -Method Put -Body ($updatedShipment | ConvertTo-Json) -ContentType "application/json"
            if ($response.status -ne "assigned") {
                throw "Shipment was not updated correctly"
            }
            Write-Host "   Updated shipment status: $($response.status)" -ForegroundColor Gray
        }
        catch {
            # Handle the case where PUT might fail on Vercel due to serverless limitations
            Write-Host "   Note: PUT operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        Write-Host "   Skipping PUT test - no shipment created" -ForegroundColor Yellow
        throw "No shipment ID available for updating"
    }
}

# Test 12: POST New Route
Run-Test "POST New Route" {
    # First get a shipment ID to associate with the route
    $shipments = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    if ($shipments.Length -gt 0) {
        $shipmentId = $shipments[0].id
        
        $newRoute = @{
            shipment_id = $shipmentId
            waypoints = @(
                @{
                    lat = 40.7128
                    lng = -74.0060
                },
                @{
                    lat = 40.7589
                    lng = -73.9851
                }
            )
            status = "pending"
            estimated_time = 30
            actual_time = $null
        }
        
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/routes" -Method Post -Body ($newRoute | ConvertTo-Json) -ContentType "application/json"
            if (-not $response.id) {
                throw "Created route does not have an ID"
            }
            Write-Host "   Created route with ID: $($response.id)" -ForegroundColor Gray
            # Store the created route ID for later tests
            $script:createdRouteId = $response.id
        }
        catch {
            # Handle the case where POST might fail on Vercel due to serverless limitations
            Write-Host "   Note: POST operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        throw "No shipments found to associate with route"
    }
}

# Test 13: PUT Update Route
Run-Test "PUT Update Route" {
    if ($script:createdRouteId) {
        # Get the current route to preserve the shipment_id
        $currentRoute = Invoke-RestMethod -Uri "$API_BASE_URL/routes/$($script:createdRouteId)" -Method Get
        
        $updatedRoute = @{
            shipment_id = $currentRoute.shipment_id  # Keep the same shipment_id
            status = "active"
            estimated_time = 25
            actual_time = 15
            waypoints = @(
                @{
                    lat = 40.7128
                    lng = -74.0060
                },
                @{
                    lat = 40.7589
                    lng = -73.9851
                },
                @{
                    lat = 40.7505
                    lng = -73.9934
                }
            )
        }
        
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/routes/$($script:createdRouteId)" -Method Put -Body ($updatedRoute | ConvertTo-Json) -ContentType "application/json"
            if ($response.status -ne "active") {
                throw "Route was not updated correctly"
            }
            Write-Host "   Updated route status: $($response.status)" -ForegroundColor Gray
        }
        catch {
            # Handle the case where PUT might fail on Vercel due to serverless limitations
            Write-Host "   Note: PUT operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        Write-Host "   Skipping PUT test - no route created" -ForegroundColor Yellow
        throw "No route ID available for updating"
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
    Write-Host "Note: POST/PUT operations may fail on Vercel serverless deployment due to limitations" -ForegroundColor Yellow
    exit 1
}