require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

// Connect to MongoDB
const connectDB = async () => {
  try {
    let uri;
    if (process.env.NODE_ENV === 'production') {
      uri = process.env.MONGODB_URI;
    } else {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${process.env.NODE_ENV === 'production' ? 'Atlas' : 'In-Memory'} at ${uri}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    // Don't exit in serverless environment
  }
};

connectDB();

// Add connection event listeners
mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// ... removed routes from here ...

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
