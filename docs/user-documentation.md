# User Documentation and Guides

This document provides comprehensive guides for users of the Last-Mile Delivery Control Tower system.

## Table of Contents

1. [System Overview](#system-overview)
2. [Dispatcher Dashboard](#dispatcher-dashboard)
3. [Driver Mobile App (PWA)](#driver-mobile-app-pwa)
4. [Admin Interface](#admin-interface)
5. [Cash on Delivery (COD)](#cash-on-delivery-cod)
6. [SLA Monitoring](#sla-monitoring)
7. [Analytics and Reporting](#analytics-and-reporting)
8. [Troubleshooting](#troubleshooting)

## System Overview

The Last-Mile Delivery Control Tower is a comprehensive system for managing last-mile delivery operations. It consists of:

1. **Dispatcher Dashboard** - Web-based interface for managing shipments, drivers, and routes
2. **Driver Mobile App** - Progressive Web App (PWA) for drivers to manage deliveries
3. **Admin Interface** - Administrative tools for system management
4. **Real-time Tracking** - Live location tracking of drivers and shipments
5. **Proof of Delivery** - Digital confirmation of successful deliveries
6. **Cash on Delivery** - Payment collection and reconciliation system
7. **SLA Monitoring** - Service Level Agreement tracking and reporting
8. **Analytics** - Business intelligence and performance metrics

## Dispatcher Dashboard

### Accessing the Dashboard

1. Open your web browser and navigate to the application URL
2. The dispatcher dashboard will load automatically

### Main Features

#### Shipments Management
- View all shipments in a list format
- Filter shipments by status (pending, assigned, in_transit, delivered, failed)
- Search shipments by tracking number
- View shipment details including origin, destination, and status

#### Driver Status Panel
- View all registered drivers
- See driver availability status (available, busy, offline)
- View driver current location on map
- Assign shipments to drivers

#### Route Visualization
- Visualize all delivery routes on an interactive map
- See real-time driver locations
- View route waypoints and progress
- Monitor delivery status with color-coded indicators

#### Notifications
- Receive real-time notifications for:
  - New shipment assignments
  - Driver status changes
  - Delivery completions
  - System alerts

### Using the Dashboard

1. **Viewing Shipments**
   - Click on the "Shipments" tab in the sidebar
   - Use the filter dropdown to view shipments by status
   - Click on any shipment to view detailed information

2. **Managing Drivers**
   - Click on the "Drivers" tab in the sidebar
   - View driver status and location
   - Assign shipments to available drivers by dragging and dropping

3. **Monitoring Routes**
   - Click on the "Routes" tab in the sidebar
   - View all active routes on the map
   - See real-time driver movement
   - Click on route markers for detailed information

## Driver Mobile App (PWA)

### Installing the App

The driver app is a Progressive Web App that can be installed on any device:

1. Open your mobile browser and navigate to the driver app URL
2. Look for the install prompt (varies by browser)
3. Tap "Install" or "Add to Home Screen"
4. The app will be installed and can be launched from your home screen

### Logging In

1. Open the driver app
2. Enter your phone number
3. You will receive an SMS with a verification code
4. Enter the verification code to log in

### Main Features

#### Dashboard
- View your assigned shipments
- See shipment status and details
- Update your availability status
- Share your current location

#### Shipment Management
- View detailed shipment information
- Navigate to delivery destination
- Update shipment status (start delivery, complete delivery)
- Capture Proof of Delivery (photo, signature, notes)

#### Location Sharing
- Share your real-time location with the dispatcher
- View your location history
- Enable/disable location sharing

#### Notifications
- Receive assignment notifications
- Get status update alerts
- Receive system notifications

### Using the Driver App

1. **Viewing Assignments**
   - The dashboard shows all your assigned shipments
   - Tap on any shipment to view details
   - Shipment status is indicated by color-coded badges

2. **Starting a Delivery**
   - Tap on an assigned shipment
   - Tap "Start Delivery" to begin
   - Your status will update to "in_transit"

3. **Completing a Delivery**
   - Navigate to the delivery destination
   - Tap on the shipment when you arrive
   - Capture Proof of Delivery (photo, signature, notes)
   - Tap "Complete Delivery" to finish

4. **Updating Your Status**
   - Tap the status chip in the dashboard header
   - Select your new status (available, busy, offline)
   - Your status will be updated in real-time

## Admin Interface

### Accessing the Admin Interface

1. Open the dispatcher dashboard
2. Click on the "Admin" tab in the sidebar

### Admin Features

#### Shipments Management
- Create, view, edit, and delete shipments
- Assign shipments to drivers
- Update shipment status manually
- View shipment history

#### Drivers Management
- Create, view, edit, and delete drivers
- Update driver information
- View driver performance metrics
- Manage driver availability

#### Routes Management
- Create, view, edit, and delete routes
- Assign shipments to routes
- View route optimization suggestions
- Manage route status

#### Cash on Delivery (COD)
- Manage COD payments
- View COD collection status
- Reconcile COD payments
- Generate COD reports

#### Reconciliation
- Reconcile collected COD payments
- View reconciliation status
- Generate reconciliation reports
- Handle failed collections

#### Analytics
- View delivery performance metrics
- Analyze driver performance
- Monitor geographic distribution
- Track time-based trends
- View COD analytics

### Using the Admin Interface

1. **Managing Shipments**
   - Click on the "Shipments" tab
   - Use the "Add Shipment" button to create new shipments
   - Click on any shipment to view/edit details
   - Use the action buttons to update status or delete

2. **Managing Drivers**
   - Click on the "Drivers" tab
   - Use the "Add Driver" button to create new drivers
   - Click on any driver to view/edit details
   - Use the action buttons to update status or delete

3. **Managing Routes**
   - Click on the "Routes" tab
   - Use the "Add Route" button to create new routes
   - Click on any route to view/edit details
   - Use the action buttons to update status or delete

## Cash on Delivery (COD)

### Overview

The Cash on Delivery system allows drivers to collect payments from customers and reconcile them with the system.

### For Dispatchers/Admins

1. **Viewing COD Payments**
   - Go to the Admin interface
   - Click on the "COD" tab
   - View all COD payments with status indicators

2. **Managing COD Payments**
   - View payment details including amount, status, and collection date
   - Update payment status (pending, collected, reconciled, failed)
   - Add notes about payments
   - Generate reports

3. **Reconciliation**
   - Go to the "Reconciliation" tab
   - View collected payments that need reconciliation
   - Reconcile individual payments or use bulk reconcile
   - View reconciliation reports

### For Drivers

1. **Viewing COD Assignments**
   - In the driver app, go to the "COD Collection" tab
   - View all shipments with COD amounts
   - See payment status

2. **Collecting Payments**
   - When delivering a COD shipment, tap on the shipment
   - Tap "Collect Payment"
   - Enter the amount collected
   - Add any notes about the collection
   - Confirm the collection

3. **Viewing Collection History**
   - View all collected payments
   - See collection dates and amounts
   - Check reconciliation status

## SLA Monitoring

### Overview

The SLA Monitoring dashboard tracks Service Level Agreement metrics to ensure delivery performance meets standards.

### Key Metrics

1. **Delivery Rate** - Percentage of shipments delivered successfully
2. **On-Time Rate** - Percentage of shipments delivered within SLA timeframe
3. **Overdue Rate** - Percentage of shipments that are overdue
4. **Average Delivery Time** - Average time to complete deliveries

### Using the SLA Dashboard

1. **Accessing the Dashboard**
   - In the dispatcher dashboard, click on "SLA Monitoring" in the sidebar

2. **Viewing Metrics**
   - View key performance indicators at the top
   - See detailed charts and graphs
   - Filter by date range
   - Filter by specific drivers

3. **Monitoring Performance**
   - Track delivery trends over time
   - Compare driver performance
   - Identify geographic delivery patterns
   - Monitor overdue shipments

4. **Taking Action**
   - Identify underperforming drivers
   - Address overdue shipments
   - Adjust routes or assignments as needed

## Analytics and Reporting

### Overview

The Analytics dashboard provides business intelligence and performance metrics to help optimize operations.

### Key Reports

1. **Delivery Trends** - Track delivery volume and success rates over time
2. **Driver Performance** - Compare driver efficiency and success rates
3. **Geographic Distribution** - Analyze delivery patterns by location
4. **Time Distribution** - Understand peak delivery times
5. **COD Analytics** - Track cash collection and reconciliation

### Using Analytics

1. **Accessing Analytics**
   - In the Admin interface, click on the "Analytics" tab

2. **Filtering Data**
   - Use date range filters to view specific periods
   - Filter by driver to analyze individual performance
   - Compare different time periods

3. **Interpreting Reports**
   - Delivery Trends: Monitor overall delivery volume and success
   - Driver Performance: Identify top performers and areas for improvement
   - Geographic Distribution: Optimize routes based on delivery density
   - Time Distribution: Staff appropriately for peak delivery times
   - COD Analytics: Track payment collection efficiency

4. **Taking Action**
   - Adjust staffing based on delivery volume trends
   - Provide training to underperforming drivers
   - Optimize routes based on geographic data
   - Adjust schedules based on time distribution

## Troubleshooting

### Common Issues and Solutions

#### Driver App Issues

1. **App Won't Load**
   - Check internet connection
   - Clear browser cache and try again
   - Ensure you're using a supported browser

2. **Location Not Updating**
   - Check location permissions in browser/app settings
   - Ensure GPS is enabled on device
   - Restart the app

3. **Can't Receive Assignments**
   - Check internet connection
   - Ensure you're logged in
   - Restart the app

#### Dispatcher Dashboard Issues

1. **Real-time Updates Not Working**
   - Check internet connection
   - Refresh the page
   - Check WebSocket connection status

2. **Map Not Loading**
   - Check internet connection
   - Ensure browser supports WebGL
   - Try a different browser

3. **Slow Performance**
   - Close other browser tabs
   - Clear browser cache
   - Check internet connection speed

#### Admin Interface Issues

1. **Can't Create/Edit Records**
   - Check internet connection
   - Ensure you have proper permissions
   - Check for validation errors in forms

2. **Reports Not Loading**
   - Check internet connection
   - Try refreshing the page
   - Check date range filters

### Contact Support

For issues not resolved by this guide, contact your system administrator or support team.