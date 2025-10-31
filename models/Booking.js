const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  promoCode: {
    type: String,
    uppercase: true
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

