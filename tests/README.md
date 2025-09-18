# Sprint 2 Backend Testing

This directory contains scripts to test the backend features implemented for Sprint 2.

## Test Scripts

### PowerShell Script
- **File**: `sprint2-backend-test.ps1`
- **Usage**: 
  ```powershell
  .\sprint2-backend-test.ps1
  ```
- **Features**: Comprehensive testing with detailed output
- **Parameters**: 
  - `-BaseUrl` (default: http://localhost:3000)
  - `-DriverId` (default: 123e4567-e89b-12d3-a456-426614174000)

### Batch Script
- **File**: `sprint2-backend-test.bat`
- **Usage**: 
  ```cmd
  sprint2-backend-test.bat
  ```
- **Features**: Simple command-line testing
- **Note**: Requires `curl` to be available in the system PATH

## What's Tested

1. Basic API connectivity
2. Driver management endpoints
3. Shipment management endpoints
4. Location tracking functionality
5. Proof of Delivery (PoD) submission
6. WebSocket server availability

## Prerequisites

1. The backend server must be running on the specified URL (default: http://localhost:3000)
2. Database must be properly configured and migrated
3. For the batch script, `curl` must be installed and available in the system PATH

## Running the Tests

### PowerShell
```powershell
# Basic usage
.\sprint2-backend-test.ps1

# With custom parameters
.\sprint2-backend-test.ps1 -BaseUrl "http://your-server:port" -DriverId "your-driver-id"
```

### Command Line (Batch)
```cmd
sprint2-backend-test.bat
```

## Expected Results

All tests should pass with green checkmarks (✅) indicating successful execution of the backend features.