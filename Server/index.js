require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const userRoute = require('./routes/userRoute');
const flowchartRoute = require('./routes/flowchartRoute');
const { verifyToken } = require('./middleware/authMiddleware');
const { verifySocketToken } = require('./middleware/authMiddleware');  

const app = express();
const PORT = process.env.PORT || 3006;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Add 'Authorization' here
};

app.use(cors(corsOptions)); 
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
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

// Apply Socket.IO token verification before handling any events
io.use(verifySocketToken);  // Add the Socket.IO token verification middleware

require('./routes/sensorSocket.js')(io);  // Socket logic
