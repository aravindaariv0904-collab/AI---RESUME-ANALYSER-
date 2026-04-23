require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using mongodb-memory-server so it works out of the box!
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB In-Memory Server Connected perfectly at ${uri}`);
  } catch (err) {
    console.log('MongoDB connection error:', err);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
