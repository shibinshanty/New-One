require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const userRoute = require('./routes/userRoute');
const sensorRoute = require('./routes/sensorRoute');
const flowchartRoute = require('./routes/flowchartRoute');
const {verifyToken} = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
app.use('/api/sensor', sensorRoute);
app.use('/api/flowchart',verifyToken,flowchartRoute);  // Protected route

// MongoDB Connection
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Socket.IO
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = socketIo(server);
require('./utils/socket.js')(io);  // Socket logic
