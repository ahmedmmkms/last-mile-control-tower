# Testing Documentation

## Backend Testing

### Unit Tests
Unit tests for controllers are located in `tests/controllers/` and use Jest with mocked database models.

### Integration Tests
Integration tests for API endpoints are located in `tests/integration/` and test the full API flow with a test database.

### Running Backend Tests
```bash
# Run all backend tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## Frontend Testing

### Component Tests
Component tests are located in `src/frontend/tests/` and use Vitest with React Testing Library.

### Running Frontend Tests
```bash
# Navigate to frontend directory
cd src/frontend

# Run frontend tests
npm test

# Run frontend tests with UI
npm run test:ui
```

## CI/CD Testing
GitHub Actions workflows automatically run all tests on push and pull requests.

### Test Environment
- PostgreSQL database for integration tests
- Node.js 16.x and 18.x matrix testing
- Automated API testing in CI pipeline