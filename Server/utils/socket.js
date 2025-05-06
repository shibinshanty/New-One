const SensorData = require('../models/sensorData'); // Adjust the path as needed

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    const intervalId = setInterval(async () => {
      const sensorData = {
        name: 'Sensor1',
        temperature: Math.random() * 30 + 20,
        humidity: Math.random() * 50 + 30,
        timestamp: new Date()
      };

      // Save to MongoDB
      try {
        const newData = new SensorData(sensorData);
        await newData.save();
      } catch (err) {
        console.error('Failed to save sensor data:', err.message);
      }

      // Emit to connected clients
      socket.emit('sensor-data', sensorData);
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(intervalId);
      console.log('Client disconnected');
    });
  });
};

  
    
  