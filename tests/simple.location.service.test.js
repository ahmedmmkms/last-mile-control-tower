// Simple Location Service Test
const { validateLocationData } = require('../src/backend/services/locationTrackingService');

describe('Simple Location Service Test', () => {
  test('should validate correct location data', () => {
    const location = {
      latitude: 40.7128,
      longitude: -74.0060
    };
    
    const result = validateLocationData(location);
    expect(result.valid).toBe(true);
  });

  test('should reject invalid latitude', () => {
    const location = {
      latitude: 95, // Invalid latitude
      longitude: -74.0060
    };
    
    const result = validateLocationData(location);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Latitude must be between -90 and 90');
  });

  test('should reject invalid longitude', () => {
    const location = {
      latitude: 40.7128,
      longitude: 190 // Invalid longitude
    };
    
    const result = validateLocationData(location);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Longitude must be between -180 and 180');
  });
});