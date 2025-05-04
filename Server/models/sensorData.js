const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name or identifier for the sensor
  temperature: { type: Number, required: true }, // Temperature value
  humidity: { type: Number, required: true }, // Humidity value
  timestamp: { type: Date, default: Date.now },  // Timestamp of the data
});

// Create the model based on the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;

