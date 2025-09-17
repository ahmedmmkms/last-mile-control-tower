# Deployment Testing Guide

## Overview
This guide outlines the steps to test the deployment of the Last-Mile Delivery Control Tower application.

## Prerequisites
- Node.js 16.x or higher
- PostgreSQL database
- Supabase account (for production deployment)

## Local Deployment Testing

### 1. Clone the Repository
```bash
git clone <repository-url>
cd last-mile-control-tower
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Run Database Migrations
```bash
npm run migrate
```

### 5. Seed Database (Optional)
```bash
npm run seed
```

### 6. Start the Application
```bash
# Start backend server
npm run dev

# In a separate terminal, start frontend development server
cd src/frontend
npm run dev
```

### 7. Access the Application
Open your browser and navigate to `http://localhost:5173`

## Production Deployment Testing

### 1. Build the Application
```bash
# Build frontend
cd src/frontend
npm run build
cd ../..

# The build-frontend script will run automatically on npm install
```

### 2. Start Production Server
```bash
npm start
```

### 3. Access the Application
Open your browser and navigate to `http://localhost:3000`

## Automated Testing

### Run All Tests
```bash
# Backend tests
npm test

# Frontend tests
cd src/frontend
npm test
```

### CI/CD Pipeline
The GitHub Actions workflow automatically runs tests on every push to the main branch and pull requests.

## Verification Checklist

### Application Components
- [ ] Backend API endpoints are accessible
- [ ] Frontend dashboard loads correctly
- [ ] Admin interface is functional
- [ ] Database connections are working
- [ ] Map visualization displays routes
- [ ] Driver status panel shows drivers
- [ ] Shipment list displays shipments

### Database
- [ ] Migrations run successfully
- [ ] Seed data is properly inserted
- [ ] CRUD operations work for all entities

### API Endpoints
- [ ] GET /api/shipments
- [ ] GET /api/drivers
- [ ] GET /api/routes
- [ ] POST/PUT/DELETE operations for all entities

## Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Verify database credentials in `.env` file
   - Ensure PostgreSQL server is running

2. **Frontend Not Loading**
   - Check if the backend server is running on port 3000
   - Verify Vite proxy configuration

3. **API Endpoints Returning 404**
   - Ensure database migrations have been run
   - Check route definitions in backend

### Logs
Check the console output for detailed error messages:
```bash
# Backend logs
npm run dev

# Frontend logs
cd src/frontend
npm run dev
```