const jwt = require('jsonwebtoken');
const SensorData = require('../models/sensorData');
require('dotenv').config(); // Ensure dotenv is required to load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Get JWT_SECRET from environment

module.exports = (io) => {
  // Protect socket connections with token verification
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Use the secret from environment
      socket.user = decoded; // Attach the user data to the socket
      next(); // Proceed with connection
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle new socket connections
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.user.email || socket.user.id}`);

    const intervalId = setInterval(async () => {
      const sensorData = {
        name: 'Sensor1',
        temperature: Math.random() * 30 + 20,
        humidity: Math.random() * 50 + 30,
        timestamp: new Date()
      };

      try {
        const newData = new SensorData(sensorData);
        await newData.save(); // Save the sensor data to the database
      } catch (err) {
        console.error('Failed to save sensor data:', err.message);
      }

      socket.emit('sensor-data', sensorData); // Emit data to client
    }, 1000); // Send data every second

    // Clean up when client disconnects
    socket.on('disconnect', () => {
      clearInterval(intervalId); // Stop the interval when the client disconnects
      console.log('Client disconnected');
    });
  });
};

    
  