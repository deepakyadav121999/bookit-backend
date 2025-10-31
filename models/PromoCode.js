const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  validFrom: {
    type: Date
  },
  validUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number
  },
  usedCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);

