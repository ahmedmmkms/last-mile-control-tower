-- Seed data for the Last-Mile Delivery Control Tower database
-- This file contains sample data for testing and demonstration purposes

-- Clear existing New York shipments
DELETE FROM routes WHERE shipment_id IN (
  SELECT id FROM shipments WHERE origin->>'address' ILIKE '%New York%' OR destination->>'address' ILIKE '%New York%'
);
DELETE FROM shipments WHERE origin->>'address' ILIKE '%New York%' OR destination->>'address' ILIKE '%New York%';

-- Clear all existing drivers (we'll replace them with Egyptian drivers)
DELETE FROM drivers;

-- Insert Egyptian drivers
INSERT INTO drivers (id, name, phone, vehicle_type, status, current_location) VALUES
('11111111-1111-1111-1111-111111111111', 'Ahmed Hassan', '+201001234567', 'car', 'available', '{"lat": 30.0444, "lng": 31.2357}'),
('22222222-2222-2222-2222-222222222222', 'Fatima Mahmoud', '+201112345678', 'bike', 'busy', '{"lat": 30.0516, "lng": 31.2487}'),
('33333333-3333-3333-3333-333333333333', 'Mohamed Ali', '+201223456789', 'van', 'available', '{"lat": 30.0427, "lng": 31.2317}'),
('44444444-4444-4444-4444-444444444444', 'Yasmine Khaled', '+201011111111', 'car', 'offline', '{"lat": 30.0778, "lng": 31.3227}'),
('55555555-5555-5555-5555-555555555555', 'Omar Mustafa', '+201122222222', 'bike', 'available', '{"lat": 30.0176, "lng": 31.2167}'),
('66666666-6666-6666-6666-666666666666', 'Nadia Samir', '+201233333333', 'van', 'busy', '{"lat": 30.0921, "lng": 31.3173}'),
('77777777-7777-7777-7777-777777777777', 'Karim Adel', '+201044444444', 'car', 'available', '{"lat": 30.0214, "lng": 31.2152}'),
('88888888-8888-8888-8888-888888888888', 'Salma Tarek', '+201155555555', 'bike', 'available', '{"lat": 30.0626, "lng": 31.3105}'),
('99999999-9999-9999-9999-999999999999', 'Hassan Youssef', '+201266666666', 'van', 'offline', '{"lat": 30.0891, "lng": 31.3247}'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Layla Mohamed', '+201077777777', 'car', 'available', '{"lat": 30.0474, "lng": 31.2336}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tarek Abbas', '+201188888888', 'bike', 'busy', '{"lat": 30.0321, "lng": 31.2219}'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Nourhan Essam', '+201299999999', 'van', 'available', '{"lat": 30.0723, "lng": 31.3165}'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Amr Fathy', '+201000000001', 'car', 'available', '{"lat": 30.0581, "lng": 31.3153}'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Dina Walid', '+201111111112', 'bike', 'offline', '{"lat": 30.0122, "lng": 31.2103}'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Islam Gamal', '+201222222223', 'van', 'available', '{"lat": 30.0882, "lng": 31.3292}'),
('10000000-0000-0000-0000-000000000001', 'Mona Khaled', '+201033333334', 'car', 'busy', '{"lat": 30.0442, "lng": 31.2365}'),
('10000000-0000-0000-0000-000000000002', 'Walid Sami', '+201144444445', 'bike', 'available', '{"lat": 30.0278, "lng": 31.2245}'),
('10000000-0000-0000-0000-000000000003', 'Rania Farid', '+201255555556', 'van', 'available', '{"lat": 30.0791, "lng": 31.3254}'),
('10000000-0000-0000-0000-000000000004', 'Hany Mostafa', '+201066666667', 'car', 'offline', '{"lat": 30.0612, "lng": 31.3139}'),
('10000000-0000-0000-0000-000000000005', 'Amina Zaki', '+201177777778', 'bike', 'available', '{"lat": 30.0389, "lng": 31.2298}'),
('10000000-0000-0000-0000-000000000006', 'Sameh Nabil', '+201288888889', 'van', 'busy', '{"lat": 30.0912, "lng": 31.3312}'),
('10000000-0000-0000-0000-000000000007', 'Hoda Emad', '+201099999990', 'car', 'available', '{"lat": 30.0554, "lng": 31.3121}'),
('10000000-0000-0000-0000-000000000008', 'Khaled Wael', '+201000000011', 'bike', 'available', '{"lat": 30.0156, "lng": 31.2134}'),
('10000000-0000-0000-0000-000000000009', 'Samar Hisham', '+201111111122', 'van', 'offline', '{"lat": 30.0823, "lng": 31.3278}'),
('10000000-0000-0000-0000-000000000010', 'Mahmoud Sobhy', '+201222222233', 'car', 'available', '{"lat": 30.0498, "lng": 31.2345}'),
('10000000-0000-0000-0000-000000000011', 'Rasha Mamdouh', '+201033333344', 'bike', 'busy', '{"lat": 30.0267, "lng": 31.2234}'),
('10000000-0000-0000-0000-000000000012', 'Essam Nagy', '+201144444455', 'van', 'available', '{"lat": 30.0745, "lng": 31.3189}'),
('10000000-0000-0000-0000-000000000013', 'Noha Ashraf', '+201255555566', 'car', 'available', '{"lat": 30.0654, "lng": 31.3167}'),
('10000000-0000-0000-0000-000000000014', 'Ashraf Kamal', '+201066666677', 'bike', 'offline', '{"lat": 30.0098, "lng": 31.2076}'),
('10000000-0000-0000-0000-000000000015', 'Maha Refaat', '+201177777788', 'van', 'available', '{"lat": 30.0865, "lng": 31.3265}'),
('10000000-0000-0000-0000-000000000016', 'Gamal Lotfy', '+201288888899', 'car', 'busy', '{"lat": 30.0523, "lng": 31.2378}'),
('10000000-0000-0000-0000-000000000017', 'Heba Taha', '+201099999900', 'bike', 'available', '{"lat": 30.0345, "lng": 31.2267}'),
('10000000-0000-0000-0000-000000000018', 'Taha Reda', '+201000000012', 'van', 'available', '{"lat": 30.0776, "lng": 31.3234}'),
('10000000-0000-0000-0000-000000000019', 'Reem Saad', '+201111111123', 'car', 'offline', '{"lat": 30.0698, "lng": 31.3198}'),
('10000000-0000-0000-0000-000000000020', 'Saad Ezzat', '+201222222234', 'bike', 'available', '{"lat": 30.0198, "lng": 31.2156}'),
('10000000-0000-0000-0000-000000000021', 'Dalia Kamal', '+201012345678', 'van', 'available', '{"lat": 30.0934, "lng": 31.3345}'),
('10000000-0000-0000-0000-000000000022', 'Kamal Adel', '+201123456789', 'car', 'busy', '{"lat": 30.0412, "lng": 31.2321}'),
('10000000-0000-0000-0000-000000000023', 'Adel Hassan', '+201234567890', 'bike', 'available', '{"lat": 30.0287, "lng": 31.2256}'),
('10000000-0000-0000-0000-000000000024', 'Hassan Omar', '+201045678901', 'van', 'offline', '{"lat": 30.0812, "lng": 31.3289}'),
('10000000-0000-0000-0000-000000000025', 'Omar Youssef', '+201156789012', 'car', 'available', '{"lat": 30.0578, "lng": 31.3145}')
ON CONFLICT (id) DO NOTHING;

-- Insert Cairo shipments
INSERT INTO shipments (id, tracking_number, status, origin, destination, assigned_driver_id) VALUES
('11111111-2222-1111-2222-111111111111', 'TRK001', 'pending', '{"address": "123 Tahrir Square, Downtown Cairo, Egypt", "lat": 30.0444, "lng": 31.2357}', '{"address": "456 Nile Corniche, Garden City, Cairo, Egypt", "lat": 30.0516, "lng": 31.2487}', NULL),
('22222222-3333-2222-3333-222222222222', 'TRK002', 'assigned', '{"address": "789 Sharia Salah Salem, Zamalek, Cairo, Egypt", "lat": 30.0581, "lng": 31.2317}', '{"address": "101 Corniche El Nil, Maadi, Cairo, Egypt", "lat": 30.0059, "lng": 31.2173}', '22222222-2222-2222-2222-222222222222'),
('33333333-4444-3333-4444-333333333333', 'TRK003', 'in_transit', '{"address": "222 Sharia Ramsis, Heliopolis, Cairo, Egypt", "lat": 30.0778, "lng": 31.3227}', '{"address": "333 El-Marg Road, El Marg, Cairo, Egypt", "lat": 30.1234, "lng": 31.3567}', '33333333-3333-3333-3333-333333333333'),
('44444444-5555-4444-5555-444444444444', 'TRK004', 'delivered', '{"address": "444 El-Haram Road, Giza, Egypt", "lat": 29.9792, "lng": 31.1344}', '{"address": "555 El-Mohandessin, Dokki, Giza, Egypt", "lat": 30.0525, "lng": 31.2078}', NULL),
('55555555-6666-5555-6666-555555555555', 'TRK005', 'pending', '{"address": "666 Sharia El-Nil, Mohandessin, Cairo, Egypt", "lat": 30.0525, "lng": 31.2078}', '{"address": "777 Nasr City, Cairo, Egypt", "lat": 30.0516, "lng": 31.3487}', NULL),
('66666666-7777-6666-7777-666666666666', 'TRK006', 'assigned', '{"address": "888 El-Rehab City, Cairo, Egypt", "lat": 30.0891, "lng": 31.3247}', '{"address": "999 New Cairo, Cairo, Egypt", "lat": 30.0427, "lng": 31.2317}', '66666666-6666-6666-6666-666666666666'),
('77777777-8888-7777-8888-777777777777', 'TRK007', 'in_transit', '{"address": "111 El-Tagammoa El-Khames, Cairo, Egypt", "lat": 30.0214, "lng": 31.2152}', '{"address": "222 El-Shorouk City, Cairo, Egypt", "lat": 30.1234, "lng": 31.5678}', '77777777-7777-7777-7777-777777777777'),
('88888888-9999-8888-9999-888888888888', 'TRK008', 'pending', '{"address": "333 El-Mostakbal City, Cairo, Egypt", "lat": 30.1345, "lng": 31.6789}', '{"address": "444 El-Khalifa El-Maamoun, Cairo, Egypt", "lat": 30.0474, "lng": 31.2336}', NULL),
('99999999-0000-9999-0000-999999999999', 'TRK009', 'assigned', '{"address": "555 El-Salam City, Cairo, Egypt", "lat": 30.0321, "lng": 31.2219}', '{"address": "666 El-Marg El-Gedida, Cairo, Egypt", "lat": 30.1456, "lng": 31.4567}', '99999999-9999-9999-9999-999999999999'),
('00000000-1111-0000-1111-000000000000', 'TRK010', 'in_transit', '{"address": "777 El-Obour City, Cairo, Egypt", "lat": 30.1567, "lng": 31.5678}', '{"address": "888 El-Shorouk El-Gedid, Cairo, Egypt", "lat": 30.1678, "lng": 31.6789}', '11111111-1111-1111-1111-111111111111'),
('11111111-0000-1111-0000-111111111112', 'TRK011', 'pending', '{"address": "999 El-Merghani Square, Cairo, Egypt", "lat": 30.0555, "lng": 31.2444}', '{"address": "111 El-Azhar Park, Cairo, Egypt", "lat": 30.0444, "lng": 31.2555}', NULL),
('22222222-1111-2222-1111-222222222223', 'TRK012', 'assigned', '{"address": "222 El-Wustan, Cairo, Egypt", "lat": 30.0333, "lng": 31.2333}', '{"address": "333 El-Masaken El-Shaabiya, Cairo, Egypt", "lat": 30.0666, "lng": 31.2666}', '11111111-1111-1111-1111-111111111111'),
('33333333-2222-3333-2222-333333333334', 'TRK013', 'delivered', '{"address": "444 El-Manial, Cairo, Egypt", "lat": 30.0222, "lng": 31.2222}', '{"address": "555 El-Rod El-Farag, Cairo, Egypt", "lat": 30.0777, "lng": 31.2777}', NULL),
('44444444-3333-4444-3333-444444444445', 'TRK014', 'pending', '{"address": "666 El-Basatin, Cairo, Egypt", "lat": 30.0111, "lng": 31.2111}', '{"address": "777 El-Sayeda Zeinab, Cairo, Egypt", "lat": 30.0888, "lng": 31.2888}', NULL),
('55555555-4444-5555-4444-555555555556', 'TRK015', 'assigned', '{"address": "888 El-Darb El-Ahmar, Cairo, Egypt", "lat": 30.0444, "lng": 31.2444}', '{"address": "999 El-Khalifa, Cairo, Egypt", "lat": 30.0999, "lng": 31.2999}', '44444444-4444-4444-4444-444444444444'),
('66666666-5555-6666-5555-666666666667', 'TRK016', 'in_transit', '{"address": "111 El-Gamaliya, Cairo, Egypt", "lat": 30.0555, "lng": 31.2555}', '{"address": "222 El-Boulaq, Cairo, Egypt", "lat": 30.1111, "lng": 31.3111}', '55555555-5555-5555-5555-555555555555'),
('77777777-6666-7777-6666-777777777778', 'TRK017', 'pending', '{"address": "333 El-Muski, Cairo, Egypt", "lat": 30.0666, "lng": 31.2666}', '{"address": "444 El-Sayeda Aisha, Cairo, Egypt", "lat": 30.1222, "lng": 31.3222}', NULL),
('88888888-7777-8888-7777-888888888889', 'TRK018', 'assigned', '{"address": "555 El-Hussein, Cairo, Egypt", "lat": 30.0777, "lng": 31.2777}', '{"address": "666 El-Ghouri, Cairo, Egypt", "lat": 30.1333, "lng": 31.3333}', '88888888-8888-8888-8888-888888888888'),
('99999999-8888-9999-8888-999999999990', 'TRK019', 'in_transit', '{"address": "777 El-Moez, Cairo, Egypt", "lat": 30.0888, "lng": 31.2888}', '{"address": "888 El-Montaza, Cairo, Egypt", "lat": 30.1444, "lng": 31.3444}', '99999999-9999-9999-9999-999999999999'),
('00000000-9999-0000-9999-000000000001', 'TRK020', 'pending', '{"address": "999 El-Azhar, Cairo, Egypt", "lat": 30.0999, "lng": 31.2999}', '{"address": "111 El-Demerdash, Cairo, Egypt", "lat": 30.1555, "lng": 31.3555}', NULL),
('11111111-1111-2222-2222-111111111113', 'TRK021', 'delivered', '{"address": "222 El-Sharea El-Gomhory, Cairo, Egypt", "lat": 30.1111, "lng": 31.3111}', '{"address": "333 El-Tahrir, Cairo, Egypt", "lat": 30.0444, "lng": 31.2357}', NULL),
('22222222-2222-3333-3333-222222222224', 'TRK022', 'pending', '{"address": "444 El-Nasr Road, Cairo, Egypt", "lat": 30.1222, "lng": 31.3222}', '{"address": "555 El-Salam Road, Cairo, Egypt", "lat": 30.1333, "lng": 31.3333}', NULL),
('33333333-3333-4444-4444-333333333335', 'TRK023', 'assigned', '{"address": "666 El-Ring Road, Cairo, Egypt", "lat": 30.1333, "lng": 31.3333}', '{"address": "777 El-Desert Road, Cairo, Egypt", "lat": 30.1444, "lng": 31.3444}', '33333333-3333-3333-3333-333333333333'),
('44444444-4444-5555-5555-444444444446', 'TRK024', 'in_transit', '{"address": "888 El-River Road, Cairo, Egypt", "lat": 30.1444, "lng": 31.3444}', '{"address": "999 El-Bridge Road, Cairo, Egypt", "lat": 30.1555, "lng": 31.3555}', '44444444-4444-4444-4444-444444444444'),
('55555555-5555-6666-6666-555555555557', 'TRK025', 'pending', '{"address": "111 El-Mountain Road, Cairo, Egypt", "lat": 30.1555, "lng": 31.3555}', '{"address": "222 El-Valley Road, Cairo, Egypt", "lat": 30.1666, "lng": 31.3666}', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample routes
INSERT INTO routes (id, shipment_id, waypoints, status, estimated_time, actual_time) VALUES
('11111111-1111-1111-1111-111111111112', '22222222-3333-2222-3333-222222222222', '[{"lat": 30.0581, "lng": 31.2317}, {"lat": 30.0289, "lng": 31.2246}, {"lat": 30.0059, "lng": 31.2173}]', 'active', 45, NULL),
('22222222-2222-2222-2222-222222222223', '33333333-4444-3333-4444-333333333333', '[{"lat": 30.0778, "lng": 31.3227}, {"lat": 30.0987, "lng": 31.3345}, {"lat": 30.1234, "lng": 31.3567}]', 'active', 35, 20),
('33333333-3333-3333-3333-333333333334', '11111111-2222-1111-2222-111111111111', '[{"lat": 30.0444, "lng": 31.2357}, {"lat": 30.0480, "lng": 31.2422}, {"lat": 30.0516, "lng": 31.2487}]', 'pending', 25, NULL),
('44444444-4444-4444-4444-444444444445', '66666666-7777-6666-7777-666666666666', '[{"lat": 30.0891, "lng": 31.3247}, {"lat": 30.0659, "lng": 31.2782}, {"lat": 30.0427, "lng": 31.2317}]', 'completed', 50, 45)
ON CONFLICT (id) DO NOTHING;