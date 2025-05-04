exports.getSensorData = (req, res) => {
    const sensorData = {
      temperature: Math.random() * 30 + 20,  // Random temperature
      humidity: Math.random() * 50 + 30,    // Random humidity
    };
  
    res.json(sensorData);
  };
  