// Location Tracking Service Tests
const { 
  validateLocationData, 
  storeDriverLocationHistory, 
  storeTrackingData, 
  getDriverLocationHistory, 
  getShipmentTrackingData 
} = require('../../src/backend/services/locationTrackingService');

describe('Location Tracking Service', () => {
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

  test('should reject missing latitude', () => {
    const location = {
      longitude: -74.0060
    };
    
    const result = validateLocationData(location);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Latitude and longitude must be numbers');
  });

  test('should reject non-numeric coordinates', () => {
    const location = {
      latitude: 'invalid',
      longitude: -74.0060
    };
    
    const result = validateLocationData(location);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Latitude and longitude must be numbers');
  });
});