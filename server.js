const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection (optional - will use dummy data if not available)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookit';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed - using dummy data mode');
    console.warn('   Error:', error.message);
    console.warn('   The API will work with in-memory dummy data');
  });

// Routes
app.use('/experiences', require('./routes/experiences'));
app.use('/bookings', require('./routes/bookings'));
app.use('/promo', require('./routes/promo'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'BookIt API - Experiences & Slots Booking',
    version: '1.0.0',
    endpoints: {
      experiences: '/experiences',
      bookings: '/bookings',
      promo: '/promo/validate'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

