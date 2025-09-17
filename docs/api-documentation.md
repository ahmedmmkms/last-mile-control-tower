# API Documentation

## Overview
This document provides documentation for the Last-Mile Delivery Control Tower API.

## Base URL
All URLs referenced in the documentation have the following base:
```
http://localhost:3000/api
```

## Authentication
No authentication is required for these API endpoints.

## Drivers

### Get all drivers
```
GET /drivers
```
Returns a list of all drivers.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "phone": "string",
    "vehicle_type": "string",
    "status": "string",
    "current_location": "json",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### Get a driver by ID
```
GET /drivers/{id}
```
Returns a specific driver by ID.

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "vehicle_type": "string",
  "status": "string",
  "current_location": "json",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Create a new driver
```
POST /drivers
```
Creates a new driver.

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "vehicle_type": "string",
  "status": "string",
  "current_location": "json"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "vehicle_type": "string",
  "status": "string",
  "current_location": "json",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Update a driver
```
PUT /drivers/{id}
```
Updates an existing driver.

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "vehicle_type": "string",
  "status": "string",
  "current_location": "json"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "vehicle_type": "string",
  "status": "string",
  "current_location": "json",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Delete a driver
```
DELETE /drivers/{id}
```
Deletes a driver.

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "vehicle_type": "string",
  "status": "string",
  "current_location": "json",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Shipments

### Get all shipments
```
GET /shipments
```
Returns a list of all shipments.

**Response:**
```json
[
  {
    "id": "uuid",
    "tracking_number": "string",
    "status": "string",
    "origin": "json",
    "destination": "json",
    "assigned_driver_id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### Get a shipment by ID
```
GET /shipments/{id}
```
Returns a specific shipment by ID.

**Response:**
```json
{
  "id": "uuid",
  "tracking_number": "string",
  "status": "string",
  "origin": "json",
  "destination": "json",
  "assigned_driver_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Create a new shipment
```
POST /shipments
```
Creates a new shipment.

**Request Body:**
```json
{
  "tracking_number": "string",
  "status": "string",
  "origin": "json",
  "destination": "json",
  "assigned_driver_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "tracking_number": "string",
  "status": "string",
  "origin": "json",
  "destination": "json",
  "assigned_driver_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Update a shipment
```
PUT /shipments/{id}
```
Updates an existing shipment.

**Request Body:**
```json
{
  "tracking_number": "string",
  "status": "string",
  "origin": "json",
  "destination": "json",
  "assigned_driver_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "tracking_number": "string",
  "status": "string",
  "origin": "json",
  "destination": "json",
  "assigned_driver_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Delete a shipment
```
DELETE /shipments/{id}
```
Deletes a shipment.

**Response:**
```json
{
  "id": "uuid",
  "tracking_number": "string",
  "status": "string",
  "origin": "json",
  "destination": "json",
  "assigned_driver_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Routes

### Get all routes
```
GET /routes
```
Returns a list of all routes.

**Response:**
```json
[
  {
    "id": "uuid",
    "shipment_id": "uuid",
    "waypoints": "json",
    "status": "string",
    "estimated_time": "integer",
    "actual_time": "integer",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### Get a route by ID
```
GET /routes/{id}
```
Returns a specific route by ID.

**Response:**
```json
{
  "id": "uuid",
  "shipment_id": "uuid",
  "waypoints": "json",
  "status": "string",
  "estimated_time": "integer",
  "actual_time": "integer",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Create a new route
```
POST /routes
```
Creates a new route.

**Request Body:**
```json
{
  "shipment_id": "uuid",
  "waypoints": "json",
  "status": "string",
  "estimated_time": "integer",
  "actual_time": "integer"
}
```

**Response:**
```json
{
  "id": "uuid",
  "shipment_id": "uuid",
  "waypoints": "json",
  "status": "string",
  "estimated_time": "integer",
  "actual_time": "integer",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Update a route
```
PUT /routes/{id}
```
Updates an existing route.

**Request Body:**
```json
{
  "shipment_id": "uuid",
  "waypoints": "json",
  "status": "string",
  "estimated_time": "integer",
  "actual_time": "integer"
}
```

**Response:**
```json
{
  "id": "uuid",
  "shipment_id": "uuid",
  "waypoints": "json",
  "status": "string",
  "estimated_time": "integer",
  "actual_time": "integer",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Delete a route
```
DELETE /routes/{id}
```
Deletes a route.

**Response:**
```json
{
  "id": "uuid",
  "shipment_id": "uuid",
  "waypoints": "json",
  "status": "string",
  "estimated_time": "integer",
  "actual_time": "integer",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```