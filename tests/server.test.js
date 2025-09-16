// Basic test for our API
const axios = require('axios');
const app = require('../index.js');

let server;

beforeAll((done) => {
  server = app.listen(3001, () => {
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

test('Server should return welcome message', async () => {
  try {
    const response = await axios.get('http://localhost:3001');
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Last-Mile Delivery Control Tower API');
    console.log('Server test passed!');
  } catch (error) {
    console.error('Error connecting to server:', error.message);
    throw error;
  }
});