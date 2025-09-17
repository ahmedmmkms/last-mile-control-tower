// Test Data Fixtures
const testFixtures = {
  // Driver fixtures
  drivers: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Ahmed Mahmoud',
      phone: '+1234567890',
      vehicle_type: 'car',
      status: 'available',
      current_location: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Sarah Johnson',
      phone: '+1234567891',
      vehicle_type: 'bike',
      status: 'busy',
      current_location: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Michael Chen',
      phone: '+1234567892',
      vehicle_type: 'van',
      status: 'available',
      current_location: { lat: 40.7505, lng: -73.9934 }
    }
  ],

  // Shipment fixtures
  shipments: [
    {
      id: '44444444-4444-4444-4444-444444444444',
      tracking_number: 'TRK001',
      status: 'pending',
      origin: { address: '123 Main St, New York, NY', lat: 40.7128, lng: -74.0060 },
      destination: { address: '456 Park Ave, New York, NY', lat: 40.7589, lng: -73.9851 },
      assigned_driver_id: null
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      tracking_number: 'TRK002',
      status: 'assigned',
      origin: { address: '789 Broadway, New York, NY', lat: 40.7505, lng: -73.9934 },
      destination: { address: '101 5th Ave, New York, NY', lat: 40.7505, lng: -73.9934 },
      assigned_driver_id: '22222222-2222-2222-2222-222222222222'
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      tracking_number: 'TRK003',
      status: 'in_transit',
      origin: { address: '222 7th Ave, New York, NY', lat: 40.7505, lng: -73.9934 },
      destination: { address: '333 8th Ave, New York, NY', lat: 40.7505, lng: -73.9934 },
      assigned_driver_id: '22222222-2222-2222-2222-222222222222'
    }
  ],

  // Route fixtures
  routes: [
    {
      id: '77777777-7777-7777-7777-777777777777',
      shipment_id: '55555555-5555-5555-5555-555555555555',
      waypoints: [
        { lat: 40.7505, lng: -73.9934 },
        { lat: 40.7589, lng: -73.9851 }
      ],
      status: 'active',
      estimated_time: 30,
      actual_time: null
    },
    {
      id: '88888888-8888-8888-8888-888888888888',
      shipment_id: '66666666-6666-6666-6666-666666666666',
      waypoints: [
        { lat: 40.7505, lng: -73.9934 },
        { lat: 40.7589, lng: -73.9851 }
      ],
      status: 'active',
      estimated_time: 25,
      actual_time: 15
    }
  ]
};

module.exports = testFixtures;