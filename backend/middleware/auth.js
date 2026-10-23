const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // JWT_SECRET must be set — never fall back to a hardcoded value
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('FATAL: JWT_SECRET environment variable is not set');
    return res.status(500).json({ msg: 'Server configuration error' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
