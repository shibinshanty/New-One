module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New client connected');
  
      // Simulate real-time sensor data
      setInterval(() => {
        socket.emit('sensor-data', {
          name: new Date().toISOString(),
          temperature: Math.random() * 30 + 20,
          humidity: Math.random() * 50 + 30,
        });
      }, 1000);
  
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  };
  