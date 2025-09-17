# Testing Documentation

This directory contains all the tests for the Last-Mile Delivery Control Tower application.

## Test Structure

- `controllers/` - Unit tests for controller functions
- `integration/` - Integration tests for API endpoints
- `fixtures/` - Test data fixtures
- `config/` - Test configuration files

## Running Tests

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### API Tests for Vercel Deployment
```bash
npm run test:api-vercel
```

### CI API Tests
```bash
npm run test:api-ci
```

### Comprehensive API Tests
```bash
npm run test:api
```

## Test Environment

The tests can run against:
1. Local development server (default)
2. Vercel deployment (using DEPLOYED_URL environment variable)

To run tests against the Vercel deployment:
```bash
DEPLOYED_URL=https://your-app-name.vercel.app npm run test:api
```

## Test Data

Test data is defined in `fixtures/testData.js` and includes sample drivers, shipments, and routes that match the production database schema.