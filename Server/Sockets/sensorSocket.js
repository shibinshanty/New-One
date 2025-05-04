// sockets/sensorSocket.js

const SensorData = require('../models/sensorData');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('📡 New client connected');

    // Simulate sensor data
    const interval = setInterval(async () => {
      const sensorData = {
        temperature: (Math.random() * 10 + 20).toFixed(2),
        humidity: (Math.random() * 10 + 50).toFixed(2),
      };

      socket.emit('sensor-data', sensorData);

      // Save data to MongoDB
      await SensorData.create(sensorData);
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Client disconnected');
    });
  });
};
