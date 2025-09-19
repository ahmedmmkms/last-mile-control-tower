-- Seed data for analytics and tracking
-- This file contains sample tracking and analytics data for testing and demonstration purposes

-- Insert sample tracking data for analytics
INSERT INTO tracking (id, shipment_id, driver_id, location, timestamp, event_type, metadata) VALUES
-- Tracking data for shipment TRK001
('20000000-0000-0000-0000-000000000001', '11111111-2222-1111-2222-111111111111', '11111111-1111-1111-1111-111111111111', '{"lat": 30.0444, "lng": 31.2357}', '2025-09-15 08:00:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000002', '11111111-2222-1111-2222-111111111111', '11111111-1111-1111-1111-111111111111', '{"lat": 30.0480, "lng": 31.2422}', '2025-09-15 08:30:00+02', 'location_update', '{"speed": 45, "heading": 45}'),
('20000000-0000-0000-0000-000000000003', '11111111-2222-1111-2222-111111111111', '11111111-1111-1111-1111-111111111111', '{"lat": 30.0516, "lng": 31.2487}', '2025-09-15 09:15:00+02', 'status_change', '{"status": "delivered", "notes": "Package delivered successfully"}'),

-- Tracking data for shipment TRK002
('20000000-0000-0000-0000-000000000004', '22222222-3333-2222-3333-222222222222', '22222222-2222-2222-2222-222222222222', '{"lat": 30.0581, "lng": 31.2317}', '2025-09-15 09:00:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000005', '22222222-3333-2222-3333-222222222222', '22222222-2222-2222-2222-222222222222', '{"lat": 30.0289, "lng": 31.2246}', '2025-09-15 10:30:00+02', 'location_update', '{"speed": 35, "heading": 180}'),
('20000000-0000-0000-0000-000000000006', '22222222-3333-2222-3333-222222222222', '22222222-2222-2222-2222-222222222222', '{"lat": 30.0059, "lng": 31.2173}', '2025-09-15 11:45:00+02', 'status_change', '{"status": "delivered", "notes": "Package delivered successfully"}'),

-- Tracking data for shipment TRK003
('20000000-0000-0000-0000-000000000007', '33333333-4444-3333-4444-333333333333', '33333333-3333-3333-3333-333333333333', '{"lat": 30.0778, "lng": 31.3227}', '2025-09-15 10:00:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000008', '33333333-4444-3333-4444-333333333333', '33333333-3333-3333-3333-333333333333', '{"lat": 30.0987, "lng": 31.3345}', '2025-09-15 11:30:00+02', 'location_update', '{"speed": 40, "heading": 90}'),
('20000000-0000-0000-0000-000000000009', '33333333-4444-3333-4444-333333333333', '33333333-3333-3333-3333-333333333333', '{"lat": 30.1234, "lng": 31.3567}', '2025-09-15 12:15:00+02', 'status_change', '{"status": "delivered", "notes": "Package delivered successfully"}'),

-- Additional tracking data for analytics diversity
('20000000-0000-0000-0000-000000000010', '44444444-5555-4444-5555-444444444444', '44444444-4444-4444-4444-444444444444', '{"lat": 30.0891, "lng": 31.3247}', '2025-09-16 08:30:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000011', '55555555-6666-5555-6666-555555555555', '55555555-5555-5555-5555-555555555555', '{"lat": 30.0427, "lng": 31.2317}', '2025-09-16 09:15:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000012', '66666666-7777-6666-7777-666666666666', '66666666-6666-6666-6666-666666666666', '{"lat": 30.0059, "lng": 31.2173}', '2025-09-16 10:45:00+02', 'status_change', '{"status": "delivered", "notes": "Package delivered successfully"}'),

-- More tracking data for time-based analytics
('20000000-0000-0000-0000-000000000013', '77777777-8888-7777-8888-777777777777', '77777777-7777-7777-7777-777777777777', '{"lat": 30.0214, "lng": 31.2152}', '2025-09-16 11:30:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000014', '88888888-9999-8888-9999-888888888888', '88888888-8888-8888-8888-888888888888', '{"lat": 30.0474, "lng": 31.2336}', '2025-09-16 14:20:00+02', 'status_change', '{"status": "delivered", "notes": "Package delivered successfully"}'),
('20000000-0000-0000-0000-000000000015', '99999999-0000-9999-0000-999999999999', '99999999-9999-9999-9999-999999999999', '{"lat": 30.0321, "lng": 31.2219}', '2025-09-16 15:45:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),

-- Tracking data for geographic analytics
('20000000-0000-0000-0000-000000000016', '00000000-1111-0000-1111-000000000000', '11111111-1111-1111-1111-111111111111', '{"lat": 30.0555, "lng": 31.2444}', '2025-09-16 16:30:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000017', '11111111-0000-1111-0000-111111111112', '22222222-2222-2222-2222-222222222222', '{"lat": 30.0333, "lng": 31.2333}', '2025-09-17 09:15:00+02', 'assignment', '{"notes": "Shipment assigned to driver"}'),
('20000000-0000-0000-0000-000000000018', '22222222-1111-2222-1111-222222222223', '33333333-3333-3333-3333-333333333333', '{"lat": 30.0222, "lng": 31.2222}', '2025-09-17 10:45:00+02', 'status_change', '{"status": "delivered", "notes": "Package delivered successfully"}')
ON CONFLICT (id) DO NOTHING;

-- Update some shipments to simulate different statuses for analytics
UPDATE shipments 
SET status = 'delivered', updated_at = '2025-09-15 09:15:00+02'
WHERE id = '11111111-2222-1111-2222-111111111111';

UPDATE shipments 
SET status = 'delivered', updated_at = '2025-09-15 11:45:00+02'
WHERE id = '22222222-3333-2222-3333-222222222222';

UPDATE shipments 
SET status = 'delivered', updated_at = '2025-09-15 12:15:00+02'
WHERE id = '33333333-4444-3333-4444-333333333333';

UPDATE shipments 
SET status = 'delivered', updated_at = '2025-09-16 10:45:00+02'
WHERE id = '66666666-7777-6666-7777-666666666666';

UPDATE shipments 
SET status = 'delivered', updated_at = '2025-09-16 14:20:00+02'
WHERE id = '88888888-9999-8888-9999-888888888888';

UPDATE shipments 
SET status = 'delivered', updated_at = '2025-09-17 10:45:00+02'
WHERE id = '22222222-1111-2222-1111-222222222223';