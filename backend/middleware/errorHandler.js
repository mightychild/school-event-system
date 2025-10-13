
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Malformed resource ID' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Default to 500 server error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message 
  });
};

module.exports = errorHandler;