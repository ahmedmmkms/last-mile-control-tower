-- Seed data for the Last-Mile Delivery Control Tower database
-- This file contains sample data for testing and demonstration purposes

-- Insert sample drivers
INSERT INTO drivers (id, name, phone, vehicle_type, status, current_location) VALUES
('11111111-1111-1111-1111-111111111111', 'Ahmed Mahmoud', '+1234567890', 'car', 'available', '{"lat": 40.7128, "lng": -74.0060}'),
('22222222-2222-2222-2222-222222222222', 'Sarah Johnson', '+1234567891', 'bike', 'busy', '{"lat": 40.7589, "lng": -73.9851}'),
('33333333-3333-3333-3333-333333333333', 'Michael Chen', '+1234567892', 'van', 'available', '{"lat": 40.7505, "lng": -73.9934}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample shipments
INSERT INTO shipments (id, tracking_number, status, origin, destination, assigned_driver_id) VALUES
('44444444-4444-4444-4444-444444444444', 'TRK001', 'pending', '{"address": "123 Main St, New York, NY", "lat": 40.7128, "lng": -74.0060}', '{"address": "456 Park Ave, New York, NY", "lat": 40.7589, "lng": -73.9851}', NULL),
('55555555-5555-5555-5555-555555555555', 'TRK002', 'assigned', '{"address": "789 Broadway, New York, NY", "lat": 40.7505, "lng": -73.9934}', '{"address": "101 5th Ave, New York, NY", "lat": 40.7505, "lng": -73.9934}', '22222222-2222-2222-2222-222222222222'),
('66666666-6666-6666-6666-666666666666', 'TRK003', 'in_transit', '{"address": "222 7th Ave, New York, NY", "lat": 40.7505, "lng": -73.9934}', '{"address": "333 8th Ave, New York, NY", "lat": 40.7505, "lng": -73.9934}', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Insert sample routes
INSERT INTO routes (id, shipment_id, waypoints, status, estimated_time, actual_time) VALUES
('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', '[{"lat": 40.7505, "lng": -73.9934}, {"lat": 40.7589, "lng": -73.9851}]', 'active', 30, NULL),
('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', '[{"lat": 40.7505, "lng": -73.9934}, {"lat": 40.7589, "lng": -73.9851}]', 'active', 25, 15)
ON CONFLICT (id) DO NOTHING;