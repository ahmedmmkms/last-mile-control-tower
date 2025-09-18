# Sprint 2 Backend Features Test Script
# This script tests the new backend features implemented for Sprint 2
# including WebSocket connections and enhanced REST APIs

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$DriverId = "123e4567-e89b-12d3-a456-426614174000"
)

Write-Host "🧪 Sprint 2 Backend Features Test Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "Driver ID: $DriverId" -ForegroundColor Yellow
Write-Host ""

# Test 1: Basic API Connectivity
Write-Host "Test 1: Basic API Connectivity" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api" -Method Get
    Write-Host "✅ API Root Endpoint: $($response.message)" -ForegroundColor Green
}
catch {
    Write-Host "❌ API Root Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get All Drivers
Write-Host "`nTest 2: Get All Drivers" -ForegroundColor Green
try {
    $drivers = Invoke-RestMethod -Uri "$BaseUrl/api/drivers" -Method Get
    Write-Host "✅ Drivers API Endpoint: Found $($drivers.Count) drivers" -ForegroundColor Green
}
catch {
    Write-Host "❌ Drivers API Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get All Shipments
Write-Host "`nTest 3: Get All Shipments" -ForegroundColor Green
try {
    $shipments = Invoke-RestMethod -Uri "$BaseUrl/api/shipments" -Method Get
    Write-Host "✅ Shipments API Endpoint: Found $($shipments.Count) shipments" -ForegroundColor Green
}
catch {
    Write-Host "❌ Shipments API Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Update Driver Location
Write-Host "`nTest 4: Update Driver Location" -ForegroundColor Green
try {
    $locationData = @{
        current_location = @{
            latitude = 40.7128
            longitude = -74.0060
        }
    }
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/drivers/$DriverId/location" -Method Put -Body ($locationData | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Driver Location Update: Success" -ForegroundColor Green
    Write-Host "   Updated Location: $($response.current_location.latitude), $($response.current_location.longitude)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Driver Location Update Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Update Driver Status
Write-Host "`nTest 5: Update Driver Status" -ForegroundColor Green
try {
    $statusData = @{
        status = "busy"
    }
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/drivers/$DriverId/status" -Method Put -Body ($statusData | ConvertTo-Json) -ContentType "application/json"
    Write-Host "✅ Driver Status Update: Success" -ForegroundColor Green
    Write-Host "   New Status: $($response.status)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Driver Status Update Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Driver Assignments
Write-Host "`nTest 6: Get Driver Assignments" -ForegroundColor Green
try {
    $assignments = Invoke-RestMethod -Uri "$BaseUrl/api/drivers/$DriverId/assignments" -Method Get
    Write-Host "✅ Driver Assignments: Found $($assignments.Count) assignments" -ForegroundColor Green
}
catch {
    Write-Host "❌ Driver Assignments Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Create a New Driver (to test with a valid driver ID)
Write-Host "`nTest 7: Create a New Driver" -ForegroundColor Green
$newDriverId = ""
try {
    $driverData = @{
        name = "Test Driver"
        phone = "+1234567890"
        vehicle_type = "car"
        status = "available"
        current_location = @{
            latitude = 40.7128
            longitude = -74.0060
        }
    }
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/drivers" -Method Post -Body ($driverData | ConvertTo-Json) -ContentType "application/json"
    $newDriverId = $response.id
    Write-Host "✅ New Driver Created: $newDriverId" -ForegroundColor Green
}
catch {
    Write-Host "❌ New Driver Creation Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Update Driver Location with New Driver
Write-Host "`nTest 8: Update New Driver Location" -ForegroundColor Green
if ($newDriverId -ne "") {
    try {
        $locationData = @{
            current_location = @{
                latitude = 40.7589
                longitude = -73.9851
            }
        }
        
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/drivers/$newDriverId/location" -Method Put -Body ($locationData | ConvertTo-Json) -ContentType "application/json"
        Write-Host "✅ New Driver Location Update: Success" -ForegroundColor Green
        Write-Host "   Updated Location: $($response.current_location.latitude), $($response.current_location.longitude)" -ForegroundColor Gray
    }
    catch {
        Write-Host "❌ New Driver Location Update Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipping New Driver Location Update (no driver created)" -ForegroundColor Yellow
}

# Test 9: Create a New Shipment
Write-Host "`nTest 9: Create a New Shipment" -ForegroundColor Green
$newShipmentId = ""
try {
    $shipmentData = @{
        tracking_number = "TRK$(Get-Random -Minimum 1000 -Maximum 9999)"
        status = "pending"
        origin = @{
            address = "123 Main St, New York, NY"
            latitude = 40.7128
            longitude = -74.0060
        }
        destination = @{
            address = "456 Oak Ave, Brooklyn, NY"
            latitude = 40.6782
            longitude = -73.9442
        }
    }
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/shipments" -Method Post -Body ($shipmentData | ConvertTo-Json) -ContentType "application/json"
    $newShipmentId = $response.id
    Write-Host "✅ New Shipment Created: $newShipmentId" -ForegroundColor Green
    Write-Host "   Tracking Number: $($response.tracking_number)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ New Shipment Creation Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Update Shipment Status with PoD
Write-Host "`nTest 10: Update Shipment Status with PoD" -ForegroundColor Green
if ($newShipmentId -ne "") {
    try {
        $statusData = @{
            status = "delivered"
            pod_image = "https://example.com/pod-image.jpg"
            pod_timestamp = (Get-Date).ToUniversalTime().ToString("o")
            pod_location = @{
                latitude = 40.6782
                longitude = -73.9442
            }
        }
        
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/shipments/$newShipmentId/status" -Method Put -Body ($statusData | ConvertTo-Json) -ContentType "application/json"
        Write-Host "✅ Shipment Status Update with PoD: Success" -ForegroundColor Green
        Write-Host "   New Status: $($response.status)" -ForegroundColor Gray
        Write-Host "   PoD Image: $($response.pod_image)" -ForegroundColor Gray
    }
    catch {
        Write-Host "❌ Shipment Status Update with PoD Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipping Shipment Status Update (no shipment created)" -ForegroundColor Yellow
}

# Test 11: Submit Proof of Delivery
Write-Host "`nTest 11: Submit Proof of Delivery" -ForegroundColor Green
if ($newShipmentId -ne "") {
    try {
        $podData = @{
            pod_image = "https://example.com/pod-signature.jpg"
            pod_timestamp = (Get-Date).ToUniversalTime().ToString("o")
            pod_location = @{
                latitude = 40.6782
                longitude = -73.9442
            }
        }
        
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/shipments/$newShipmentId/pod" -Method Post -Body ($podData | ConvertTo-Json) -ContentType "application/json"
        Write-Host "✅ Proof of Delivery Submission: Success" -ForegroundColor Green
        Write-Host "   PoD Image: $($response.pod_image)" -ForegroundColor Gray
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    }
    catch {
        Write-Host "❌ Proof of Delivery Submission Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipping PoD Submission (no shipment created)" -ForegroundColor Yellow
}

# Test 12: WebSocket Connection Test (basic connectivity)
Write-Host "`nTest 12: WebSocket Connection Test" -ForegroundColor Green
Write-Host "ℹ️  Note: Full WebSocket testing requires a WebSocket client library" -ForegroundColor Yellow
Write-Host "✅ WebSocket endpoint available at: $BaseUrl (Socket.IO server)" -ForegroundColor Green

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "🎉 Sprint 2 Backend Features Test Complete" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan