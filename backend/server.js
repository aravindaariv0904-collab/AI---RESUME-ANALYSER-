require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — restrict to known frontend origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

// Connect to MongoDB
const connectDB = async () => {
  try {
    let uri;
    if (process.env.NODE_ENV === 'production') {
      uri = process.env.MONGODB_URI;
      if (!uri) {
        console.error('FATAL: MONGODB_URI is not set in production');
        process.exit(1);
      }
    } else {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${process.env.NODE_ENV === 'production' ? 'Atlas' : 'In-Memory'}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit in serverless environment
  }
};

connectDB();

// Add connection event listeners
mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
