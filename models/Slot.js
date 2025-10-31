const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 10
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
slotSchema.index({ experienceId: 1, date: 1 });
slotSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Slot', slotSchema);

