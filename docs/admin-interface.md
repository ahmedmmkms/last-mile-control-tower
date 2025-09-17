# Admin Interface Documentation

## Overview
The Admin Interface provides full CRUD (Create, Read, Update, Delete) operations for all core entities in the Last-Mile Delivery Control Tower system.

## Features

### Shipment Management
- Create new shipments with tracking numbers, status, origin, and destination
- Edit existing shipments
- Delete shipments
- View all shipments in a table format
- Filter shipments by tracking number, status, or driver

### Driver Management
- Create new drivers with name, phone, vehicle type, and status
- Edit existing driver information
- Delete drivers
- View all drivers with their current status and location
- Manage driver availability (available, busy, offline)

### Route Management
- Create new routes and assign them to shipments
- Edit existing routes
- Delete routes
- Manage waypoints for each route
- View route status and estimated completion time

## Access
The Admin Interface can be accessed through the sidebar navigation in the Dispatcher Dashboard by clicking on the "Admin" menu item.

## Technology
- Built with React.js and Material UI
- Uses the existing API service for all backend communication
- Responsive design that works on desktop, tablet, and mobile devices