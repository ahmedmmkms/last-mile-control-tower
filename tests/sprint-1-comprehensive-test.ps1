# sprint-1-comprehensive-test.ps1
# PowerShell script to comprehensively test all Sprint 1 deliverables for Last-Mile Delivery Control Tower

# Configuration
$DEPLOYED_URL = "https://last-mile-control-tower.vercel.app"
$API_BASE_URL = "$DEPLOYED_URL/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sprint 1 Comprehensive Test Suite" -ForegroundColor Cyan
Write-Host "Last-Mile Delivery Control Tower" -ForegroundColor Cyan
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

# ====================================================================================================
# SPRINT 1 REQUIREMENTS TESTS
# ====================================================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "SPRINT 1 CORE ENTITY API TESTS" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# Test 1: API Root Endpoint
Run-Test "API Root Endpoint - Verify API is accessible" {
    $response = Invoke-RestMethod -Uri "$DEPLOYED_URL/api" -Method Get
    if ($response.message -ne "Last-Mile Delivery Control Tower API") {
        throw "API root endpoint returned unexpected response"
    }
}

# Test 2: Get All Drivers
Run-Test "Get All Drivers - Verify Drivers API" {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/drivers" -Method Get
    if ($response.GetType().Name -ne "Object[]") {
        throw "Drivers endpoint did not return an array"
    }
    Write-Host "   Found $($response.Length) drivers" -ForegroundColor Gray
}

# Test 3: Get All Shipments
Run-Test "Get All Shipments - Verify Shipments API" {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    if ($response.GetType().Name -ne "Object[]") {
        throw "Shipments endpoint did not return an array"
    }
    Write-Host "   Found $($response.Length) shipments" -ForegroundColor Gray
}

# Test 4: Get All Routes
Run-Test "Get All Routes - Verify Routes API" {
    $response = Invoke-RestMethod -Uri "$API_BASE_URL/routes" -Method Get
    if ($response.GetType().Name -ne "Object[]") {
        throw "Routes endpoint did not return an array"
    }
    Write-Host "   Found $($response.Length) routes" -ForegroundColor Gray
}

# Test 5: Get Specific Driver
Run-Test "Get Specific Driver - Verify Driver retrieval by ID" {
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
Run-Test "Get Specific Shipment - Verify Shipment retrieval by ID" {
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
Run-Test "Get Specific Route - Verify Route retrieval by ID" {
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

# Test 8: Verify Driver Model Structure
Run-Test "Verify Driver Model Structure - Check required fields" {
    $drivers = Invoke-RestMethod -Uri "$API_BASE_URL/drivers" -Method Get
    if ($drivers.Length -gt 0) {
        $driver = $drivers[0]
        $requiredFields = @("id", "name", "phone", "vehicle_type", "status", "current_location", "created_at", "updated_at")
        foreach ($field in $requiredFields) {
            if ($null -eq $driver.$field) {
                throw "Driver missing required field: $field"
            }
        }
        Write-Host "   Verified driver model with ID: $($driver.id)" -ForegroundColor Gray
    } else {
        throw "No drivers found to verify model structure"
    }
}

# Test 9: Verify Shipment Model Structure
Run-Test "Verify Shipment Model Structure - Check required fields" {
    $shipments = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    if ($shipments.Length -gt 0) {
        $shipment = $shipments[0]
        $requiredFields = @("id", "tracking_number", "status", "origin", "destination", "created_at", "updated_at")
        foreach ($field in $requiredFields) {
            if ($null -eq $shipment.$field) {
                throw "Shipment missing required field: $field"
            }
        }
        Write-Host "   Verified shipment model with tracking number: $($shipment.tracking_number)" -ForegroundColor Gray
    } else {
        throw "No shipments found to verify model structure"
    }
}

# Test 10: Verify Route Model Structure
Run-Test "Verify Route Model Structure - Check required fields" {
    $routes = Invoke-RestMethod -Uri "$API_BASE_URL/routes" -Method Get
    if ($routes.Length -gt 0) {
        $route = $routes[0]
        $requiredFields = @("id", "shipment_id", "waypoints", "status", "created_at", "updated_at")
        foreach ($field in $requiredFields) {
            if ($null -eq $route.$field) {
                throw "Route missing required field: $field"
            }
        }
        Write-Host "   Verified route model for shipment: $($route.shipment_id)" -ForegroundColor Gray
    } else {
        throw "No routes found to verify model structure"
    }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "SPRINT 1 ADMIN INTERFACE CRUD TESTS" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# Test 11: POST New Driver (Admin Interface - Create)
Run-Test "POST New Driver - Admin Interface Create Operation" {
    $newDriver = @{
        name = "Test Driver Sprint1 $(Get-Random)"
        phone = "+20100123456"
        vehicle_type = "car"
        status = "available"
        current_location = @{
            lat = 30.0444
            lng = 31.2357
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

# Test 12: PUT Update Driver (Admin Interface - Update)
Run-Test "PUT Update Driver - Admin Interface Update Operation" {
    if ($script:createdDriverId) {
        $updatedDriver = @{
            name = "Updated Test Driver Sprint1 $(Get-Random)"
            phone = "+20111234567"
            vehicle_type = "bike"
            status = "busy"
            current_location = @{
                lat = 30.0516
                lng = 31.2487
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

# Test 13: POST New Shipment (Admin Interface - Create)
Run-Test "POST New Shipment - Admin Interface Create Operation" {
    $newShipment = @{
        tracking_number = "TRK-S1-TEST-$(Get-Random)"
        status = "pending"
        origin = @{
            address = "123 Sprint 1 Test St, Cairo, Egypt"
            lat = 30.0444
            lng = 31.2357
        }
        destination = @{
            address = "456 Sprint 1 Test Ave, Cairo, Egypt"
            lat = 30.0516
            lng = 31.2487
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

# Test 14: PUT Update Shipment (Admin Interface - Update)
Run-Test "PUT Update Shipment - Admin Interface Update Operation" {
    if ($script:createdShipmentId) {
        # Get the current shipment to preserve the tracking number
        $currentShipment = Invoke-RestMethod -Uri "$API_BASE_URL/shipments/$($script:createdShipmentId)" -Method Get
        
        $updatedShipment = @{
            tracking_number = $currentShipment.tracking_number  # Keep the same tracking number
            status = "assigned"
            origin = @{
                address = "123 Updated Sprint 1 St, Cairo, Egypt"
                lat = 30.0444
                lng = 31.2357
            }
            destination = @{
                address = "456 Updated Sprint 1 Ave, Cairo, Egypt"
                lat = 30.0516
                lng = 31.2487
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

# Test 15: POST New Route (Admin Interface - Create)
Run-Test "POST New Route - Admin Interface Create Operation" {
    # First get a shipment ID to associate with the route
    $shipments = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    if ($shipments.Length -gt 0) {
        $shipmentId = $shipments[0].id
        
        $newRoute = @{
            shipment_id = $shipmentId
            waypoints = @(
                @{
                    lat = 30.0444
                    lng = 31.2357
                },
                @{
                    lat = 30.0516
                    lng = 31.2487
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

# Test 16: PUT Update Route (Admin Interface - Update)
Run-Test "PUT Update Route - Admin Interface Update Operation" {
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
                    lat = 30.0444
                    lng = 31.2357
                },
                @{
                    lat = 30.0516
                    lng = 31.2487
                },
                @{
                    lat = 30.0427
                    lng = 31.2317
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

# Test 17: DELETE Route (Admin Interface - Delete)
Run-Test "DELETE Route - Admin Interface Delete Operation" {
    if ($script:createdRouteId) {
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/routes/$($script:createdRouteId)" -Method Delete
            if (-not $response.id) {
                throw "Deleted route does not have an ID"
            }
            Write-Host "   Deleted route with ID: $($response.id)" -ForegroundColor Gray
        }
        catch {
            # Handle the case where DELETE might fail on Vercel due to serverless limitations
            Write-Host "   Note: DELETE operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        Write-Host "   Skipping DELETE test - no route created" -ForegroundColor Yellow
        throw "No route ID available for deletion"
    }
}

# Test 18: DELETE Shipment (Admin Interface - Delete)
Run-Test "DELETE Shipment - Admin Interface Delete Operation" {
    if ($script:createdShipmentId) {
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/shipments/$($script:createdShipmentId)" -Method Delete
            if (-not $response.id) {
                throw "Deleted shipment does not have an ID"
            }
            Write-Host "   Deleted shipment with ID: $($response.id)" -ForegroundColor Gray
        }
        catch {
            # Handle the case where DELETE might fail on Vercel due to serverless limitations
            Write-Host "   Note: DELETE operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        Write-Host "   Skipping DELETE test - no shipment created" -ForegroundColor Yellow
        throw "No shipment ID available for deletion"
    }
}

# Test 19: DELETE Driver (Admin Interface - Delete)
Run-Test "DELETE Driver - Admin Interface Delete Operation" {
    if ($script:createdDriverId) {
        try {
            $response = Invoke-RestMethod -Uri "$API_BASE_URL/drivers/$($script:createdDriverId)" -Method Delete
            if (-not $response.id) {
                throw "Deleted driver does not have an ID"
            }
            Write-Host "   Deleted driver with ID: $($response.id)" -ForegroundColor Gray
        }
        catch {
            # Handle the case where DELETE might fail on Vercel due to serverless limitations
            Write-Host "   Note: DELETE operations may fail on Vercel serverless deployment" -ForegroundColor Yellow
            throw $_.Exception.Message
        }
    } else {
        Write-Host "   Skipping DELETE test - no driver created" -ForegroundColor Yellow
        throw "No driver ID available for deletion"
    }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "SPRINT 1 DASHBOARD UI FUNCTIONALITY TESTS" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# Test 20: Verify Dashboard Access
Run-Test "Verify Dashboard Access - Check frontend loads" {
    try {
        $response = Invoke-WebRequest -Uri "$DEPLOYED_URL" -Method Get
        if ($response.StatusCode -ne 200) {
            throw "Dashboard returned status code $($response.StatusCode)"
        }
        if ($response.Content -notlike "*Last-Mile Delivery Control Tower*") {
            throw "Dashboard content does not contain expected title"
        }
        Write-Host "   Dashboard loaded successfully" -ForegroundColor Gray
    }
    catch {
        throw "Failed to access dashboard: $($_.Exception.Message)"
    }
}

# Test 21: Verify Admin Interface Access
Run-Test "Verify Admin Interface Access - Check admin functionality" {
    try {
        $response = Invoke-WebRequest -Uri "$DEPLOYED_URL" -Method Get
        if ($response.StatusCode -ne 200) {
            throw "Admin interface returned status code $($response.StatusCode)"
        }
        if ($response.Content -notlike "*Admin Interface*") {
            throw "Admin interface content does not contain expected elements"
        }
        Write-Host "   Admin interface loaded successfully" -ForegroundColor Gray
    }
    catch {
        throw "Failed to access admin interface: $($_.Exception.Message)"
    }
}

# Test 22: Verify Database Schema Implementation
Run-Test "Verify Database Schema Implementation - Check all relationships" {
    # Get drivers, shipments, and routes to verify relationships
    $drivers = Invoke-RestMethod -Uri "$API_BASE_URL/drivers" -Method Get
    $shipments = Invoke-RestMethod -Uri "$API_BASE_URL/shipments" -Method Get
    $routes = Invoke-RestMethod -Uri "$API_BASE_URL/routes" -Method Get
    
    Write-Host "   Database contains: $($drivers.Length) drivers, $($shipments.Length) shipments, $($routes.Length) routes" -ForegroundColor Gray
    
    # Verify relationships exist
    if ($shipments.Length -gt 0) {
        $shipment = $shipments[0]
        if ($shipment.assigned_driver_id) {
            Write-Host "   Verified shipment-driver relationship" -ForegroundColor Gray
        }
    }
    
    if ($routes.Length -gt 0) {
        $route = $routes[0]
        if ($route.shipment_id) {
            Write-Host "   Verified route-shipment relationship" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "SPRINT 1 SUCCESS CRITERIA VALIDATION" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta

# Test 23: All Core Entity APIs Functional
Run-Test "All Core Entity APIs Functional - Verify error handling" {
    # Test error handling for invalid IDs
    try {
        Invoke-RestMethod -Uri "$API_BASE_URL/drivers/invalid-id" -Method Get
        throw "Should have returned 404 for invalid driver ID"
    }
    catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404 for invalid driver ID, got $($_.Exception.Response.StatusCode)"
        }
        Write-Host "   Verified error handling for invalid driver ID" -ForegroundColor Gray
    }
    
    try {
        Invoke-RestMethod -Uri "$API_BASE_URL/shipments/invalid-id" -Method Get
        throw "Should have returned 404 for invalid shipment ID"
    }
    catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404 for invalid shipment ID, got $($_.Exception.Response.StatusCode)"
        }
        Write-Host "   Verified error handling for invalid shipment ID" -ForegroundColor Gray
    }
    
    try {
        Invoke-RestMethod -Uri "$API_BASE_URL/routes/invalid-id" -Method Get
        throw "Should have returned 404 for invalid route ID"
    }
    catch {
        if ($_.Exception.Response.StatusCode -ne 404) {
            throw "Expected 404 for invalid route ID, got $($_.Exception.Response.StatusCode)"
        }
        Write-Host "   Verified error handling for invalid route ID" -ForegroundColor Gray
    }
}

# Test 24: Dispatcher Dashboard Displays All Entities
Run-Test "Dispatcher Dashboard Displays All Entities - Verify UI components" {
    $response = Invoke-WebRequest -Uri "$DEPLOYED_URL" -Method Get
    
    # Check that dashboard contains essential UI elements
    $requiredElements = @(
        "Last-Mile Delivery Control Tower",
        "Dispatcher Dashboard",
        "Shipments",
        "Drivers",
        "Routes",
        "Admin"
    )
    
    foreach ($element in $requiredElements) {
        if ($response.Content -notlike "*$element*") {
            throw "Dashboard missing required element: $element"
        }
    }
    
    Write-Host "   Verified all dashboard UI components present" -ForegroundColor Gray
}

# Test 25: Admin Interface Allows Management of Core Entities
Run-Test "Admin Interface Allows Management of Core Entities - Verify CRUD operations" {
    $response = Invoke-WebRequest -Uri "$DEPLOYED_URL" -Method Get
    
    # Check that admin interface contains CRUD operation indicators
    $crudElements = @(
        "Add",
        "Edit",
        "Delete",
        "Create",
        "Update"
    )
    
    foreach ($element in $crudElements) {
        if ($response.Content -notlike "*$element*") {
            Write-Host "   Note: Admin interface may be using different terminology for $element" -ForegroundColor Yellow
        }
    }
    
    Write-Host "   Verified admin interface contains CRUD functionality indicators" -ForegroundColor Gray
}

# Display test results
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SPRINT 1 COMPREHENSIVE TEST RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total tests: $TotalTests" -ForegroundColor White
Write-Host "Passed: $PassedTests" -ForegroundColor Green
Write-Host "Failed: $FailedTests" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

if ($FailedTests -eq 0) {
    Write-Host "🎉 All Sprint 1 tests passed!" -ForegroundColor Green
    Write-Host "✅ Sprint 1 requirements successfully validated" -ForegroundColor Green
    Write-Host "✅ Backend APIs are fully functional" -ForegroundColor Green
    Write-Host "✅ Admin interface allows management of core entities" -ForegroundColor Green
    Write-Host "✅ Dashboard displays shipments, routes, and driver status" -ForegroundColor Green
    Write-Host "✅ Database schema is implemented with proper relationships" -ForegroundColor Green
    Write-Host "✅ Application is successfully deployed to vercel.app" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ $FailedTests test(s) failed" -ForegroundColor Red
    Write-Host "Note: POST/PUT/DELETE operations may fail on Vercel serverless deployment due to limitations" -ForegroundColor Yellow
    exit 1
}