# Deployment Testing Scripts

This directory contains several scripts to test the deployed Vercel application.

## Available Test Scripts

### 1. PowerShell Script (Windows)
```powershell
.\tests\Test-LastMileAPI.ps1
```

### 2. Batch Script (Windows Command Prompt)
```cmd
.\tests\Test-LastMileAPI.bat
```

### 3. Node.js Script
```bash
npm run test:vercel
```

## What These Tests Verify

1. **API Root Endpoint** - Verifies the API is accessible
2. **Drivers Endpoint** - Verifies drivers can be retrieved
3. **Shipments Endpoint** - Verifies shipments can be retrieved
4. **Routes Endpoint** - Verifies routes can be retrieved
5. **Specific Resource Endpoints** - Verifies individual resources can be retrieved by ID

## Expected Results

All tests should pass if the Vercel deployment is working correctly. The tests will show:
- ✅ for passed tests
- ❌ for failed tests

## Troubleshooting

If tests fail:
1. Check that the Vercel deployment is active
2. Verify the URL in the script matches your deployment
3. Check the Vercel logs for any errors