# Database Schema Design

This document outlines the database schema for the Last-Mile Delivery Control Tower application.

## Core Entities

### 1. Shipments

The shipments table stores information about each delivery shipment.

```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  assigned_driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Fields:
- `id`: Unique identifier for the shipment
- `tracking_number`: Unique tracking number for the shipment
- `status`: Current status of the shipment (pending, assigned, in_transit, delivered, failed)
- `origin`: JSON object containing origin address details
- `destination`: JSON object containing destination address details
- `assigned_driver_id`: Reference to the driver assigned to this shipment
- `created_at`: Timestamp when the shipment was created
- `updated_at`: Timestamp when the shipment was last updated

### 2. Routes

The routes table stores information about delivery routes.

```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id),
  waypoints JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  estimated_time INTEGER, -- in minutes
  actual_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Fields:
- `id`: Unique identifier for the route
- `shipment_id`: Reference to the shipment this route is for
- `waypoints`: JSON array of coordinate points for the route
- `status`: Current status of the route (pending, active, completed)
- `estimated_time`: Estimated time to complete the route in minutes
- `actual_time`: Actual time taken to complete the route in minutes
- `created_at`: Timestamp when the route was created
- `updated_at`: Timestamp when the route was last updated

### 3. Drivers

The drivers table stores information about delivery drivers.

```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  current_location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Fields:
- `id`: Unique identifier for the driver
- `name`: Driver's full name
- `phone`: Driver's phone number
- `vehicle_type`: Type of vehicle the driver uses (bike, car, van)
- `status`: Current status of the driver (available, busy, offline)
- `current_location`: JSON object containing current latitude and longitude
- `created_at`: Timestamp when the driver record was created
- `updated_at`: Timestamp when the driver record was last updated

## Relationships

1. A shipment can have one route (one-to-one)
2. A shipment can be assigned to one driver (many-to-one)
3. A driver can have many shipments (one-to-many)

## Indexes

```sql
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_assigned_driver_id ON shipments(assigned_driver_id);
CREATE INDEX idx_routes_shipment_id ON routes(shipment_id);
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_drivers_status ON drivers(status);
```