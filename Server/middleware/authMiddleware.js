const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided!' });
  }

  const token = authHeader.split(' ')[1]; // Format: Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with env in production
    req.user = decoded; // Now req.user contains id and email
    next(); // Proceed to actual route
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token!' });
  }
};


exports.verifySocketToken = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided!'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid or expired token!'));
  }
};