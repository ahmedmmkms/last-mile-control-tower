# Sprint 1: Core Entities & Admin Dashboard - Detailed Plan

## Overview
This sprint focuses on implementing the core backend APIs, database schema, and the dispatcher dashboard with route visualization. We'll be building the foundational elements that will support all future functionality.

## Sprint Goals
1. Implement backend APIs for core entities (Shipments, Routes, Drivers)
2. Create dispatcher dashboard with route visualization
3. Develop basic admin interface for managing core entities
4. Implement database schema and seed data
5. Enhance CI/CD pipeline with backend testing

## Detailed Task Breakdown

### Backend Development (Core Entities & APIs)

#### 1. Database Implementation
- [x] Design and implement database schema for:
  - Shipments table (id, tracking_number, status, origin, destination, assigned_driver_id, created_at, updated_at)
  - Routes table (id, shipment_id, waypoints, status, estimated_time, actual_time, created_at, updated_at)
  - Drivers table (id, name, phone, vehicle_type, status, current_location, created_at, updated_at)
- [x] Create database migration files
- [x] Implement seed data for demo purposes
- [x] Set up database connection and configuration
- [x] Test database connection and verify schema
- [x] Enhance migration scripts to handle repeated runs (IF NOT EXISTS)
- [x] Enhance seed scripts to handle repeated runs (ON CONFLICT)
- [x] Test updated migration and seed scripts
- [x] Verify data was properly seeded

#### 2. Backend API Development
- [x] Implement Shipment controller with CRUD operations:
  - GET /api/shipments - List all shipments
  - GET /api/shipments/:id - Get specific shipment
  - POST /api/shipments - Create new shipment
  - PUT /api/shipments/:id - Update shipment
  - DELETE /api/shipments/:id - Delete shipment
- [x] Implement Route controller with CRUD operations:
  - GET /api/routes - List all routes
  - GET /api/routes/:id - Get specific route
  - POST /api/routes - Create new route
  - PUT /api/routes/:id - Update route
  - DELETE /api/routes/:id - Delete route
- [x] Implement Driver controller with CRUD operations:
  - GET /api/drivers - List all drivers
  - GET /api/drivers/:id - Get specific driver
  - POST /api/drivers - Create new driver
  - PUT /api/drivers/:id - Update driver
  - DELETE /api/drivers/:id - Delete driver
- [x] Implement route assignment logic:
  - Algorithm to assign shipments to drivers based on proximity
  - Update shipment and driver status upon assignment
- [x] Add API documentation (Swagger/OpenAPI)

#### 3. Backend Testing
- [x] Create unit tests for all controller functions
- [x] Create integration tests for API endpoints
- [x] Implement test data fixtures
- [x] Configure test database environment

### Frontend Development (Dispatcher Dashboard)

#### 1. Dashboard UI Implementation
- [ ] Create dashboard layout with:
  - Header with navigation
  - Sidebar with menu options
  - Main content area for visualization
- [ ] Implement shipment list view:
  - Table with shipment details
  - Filter and search functionality
  - Status indicators
- [ ] Implement route visualization:
  - Map component for route display
  - Waypoint markers
  - Route path visualization
- [ ] Implement driver status panel:
  - List of drivers with current status
  - Location indicators
  - Assignment status

#### 2. Admin Interface
- [ ] Create shipment management interface:
  - Form for creating/editing shipments
  - Validation for required fields
  - Status update functionality
- [ ] Create driver management interface:
  - Form for creating/editing drivers
  - Status management
  - Vehicle type selection
- [ ] Create route management interface:
  - Route creation wizard
  - Waypoint editor
  - Assignment interface

#### 3. Frontend Testing
- [ ] Create component tests for UI elements
- [ ] Implement end-to-end tests for core workflows
- [ ] Test responsive design on different screen sizes

### CI/CD Enhancements
- [ ] Enhance GitHub Actions workflows with backend testing
- [ ] Add database migration steps to deployment pipeline
- [ ] Configure environment-specific settings
- [ ] Implement automated API testing in CI pipeline

## Technical Requirements

### Backend Stack
- Node.js with Express.js
- PostgreSQL database
- RESTful API design
- JSON for data exchange

### Frontend Stack
- React.js for dashboard
- Leaflet.js or similar for map visualization
- CSS Framework (Bootstrap/Material UI)
- Responsive design principles

### Data Models

#### Shipment Model
```
- id (UUID)
- tracking_number (string, unique)
- status (enum: pending, assigned, in_transit, delivered, failed)
- origin (JSON: address details)
- destination (JSON: address details)
- assigned_driver_id (foreign key to Drivers)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Route Model
```
- id (UUID)
- shipment_id (foreign key to Shipments)
- waypoints (JSON array of coordinates)
- status (enum: pending, active, completed)
- estimated_time (integer, minutes)
- actual_time (integer, minutes)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Driver Model
```
- id (UUID)
- name (string)
- phone (string)
- vehicle_type (enum: bike, car, van)
- status (enum: available, busy, offline)
- current_location (JSON: latitude, longitude)
- created_at (timestamp)
- updated_at (timestamp)
```

## Success Criteria
- [ ] All core entity APIs are functional with proper error handling
- [ ] Dispatcher dashboard displays shipments, routes, and driver status
- [ ] Admin interface allows creation and management of core entities
- [ ] Database schema is implemented with proper relationships
- [ ] Comprehensive test coverage for backend and frontend
- [ ] CI/CD pipeline successfully deploys updated application
- [ ] Application is deployed to vercel.app and accessible

## Dependencies
- Database connection credentials
- Map API key (if using external service)
- GitHub repository access
- Vercel deployment access

## Risks and Mitigations
- **Risk**: Complex route optimization algorithm
  - **Mitigation**: Start with simple proximity-based assignment, enhance later
- **Risk**: Map visualization performance with many routes
  - **Mitigation**: Implement clustering and pagination
- **Risk**: Database migration issues
  - **Mitigation**: Thorough testing in development environment first

## Timeline
Weeks 1-3 (3 weeks total)