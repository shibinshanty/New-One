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

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Change this to your frontend URL
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
app.use('/api/sensor', sensorRoute);
app.use('/api/flowchart', verifyToken, flowchartRoute);  // Protected route

// MongoDB Connection
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Socket.IO with CORS support
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

require('./utils/socket.js')(io);  // Socket logic

