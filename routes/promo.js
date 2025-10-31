const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const PromoCode = require('../models/PromoCode');

// Dummy promo codes
const dummyPromoCodes = {
  'SAVE10': { discountType: 'percentage', discountValue: 10 },
  'FLAT100': { discountType: 'flat', discountValue: 100 },
  'FIRST20': { discountType: 'percentage', discountValue: 20 }
};

// POST validate promo code
router.post('/validate', [
  body('code').notEmpty(),
  body('amount').optional().isNumeric(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, amount = 999 } = req.body;
    const upperCode = code.toUpperCase();

    let promoCode = null;
    let discount = 0;

    // Try DB first
    try {
      promoCode = await PromoCode.findOne({ 
        code: upperCode, 
        isActive: true 
      });

      if (promoCode) {
        // Check validity period
        const now = new Date();
        if (promoCode.validFrom && new Date(promoCode.validFrom) > now) {
          return res.json({ 
            valid: false, 
            discount: 0, 
            message: 'Promo code not yet valid' 
          });
        }

        if (promoCode.validUntil && new Date(promoCode.validUntil) < now) {
          return res.json({ 
            valid: false, 
            discount: 0, 
            message: 'Promo code expired' 
          });
        }

        // Check usage limit
        if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
          return res.json({ 
            valid: false, 
            discount: 0, 
            message: 'Promo code usage limit reached' 
          });
        }

        // Calculate discount
        if (promoCode.discountType === 'percentage') {
          discount = Math.round((amount * promoCode.discountValue) / 100);
        } else if (promoCode.discountType === 'flat') {
          discount = promoCode.discountValue;
        }

        discount = Math.min(discount, amount);

        return res.json({ 
          valid: true, 
          discount, 
          discountType: promoCode.discountType,
          discountValue: promoCode.discountValue,
          message: 'Promo code applied successfully' 
        });
      }
    } catch (dbError) {
      console.log('DB error, using dummy promo codes:', dbError.message);
    }

    // Fallback to dummy promo codes
    const dummyPromo = dummyPromoCodes[upperCode];
    
    if (!dummyPromo) {
      return res.json({ 
        valid: false, 
        discount: 0, 
        message: 'Invalid promo code' 
      });
    }

    // Calculate discount from dummy promo
    if (dummyPromo.discountType === 'percentage') {
      discount = Math.round((amount * dummyPromo.discountValue) / 100);
    } else if (dummyPromo.discountType === 'flat') {
      discount = dummyPromo.discountValue;
    }

    discount = Math.min(discount, amount);

    res.json({ 
      valid: true, 
      discount,
      discountType: dummyPromo.discountType,
      discountValue: dummyPromo.discountValue,
      message: 'Promo code applied successfully' 
    });
  } catch (error) {
    // Fallback for any error
    res.json({ 
      valid: false, 
      discount: 0, 
      message: 'Error validating promo code' 
    });
  }
});

// POST seed promo codes
router.post('/seed', async (req, res) => {
  try {
    const count = await PromoCode.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Promo codes already seeded' });
    }

    const promoCodes = [
      {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        isActive: true,
        usageLimit: 100,
        usedCount: 0
      },
      {
        code: 'FLAT100',
        discountType: 'flat',
        discountValue: 100,
        isActive: true,
        usageLimit: 50,
        usedCount: 0
      },
      {
        code: 'FIRST20',
        discountType: 'percentage',
        discountValue: 20,
        isActive: true,
        usageLimit: 25,
        usedCount: 0
      }
    ];

    await PromoCode.insertMany(promoCodes);

    res.json({ 
      message: 'Promo codes seeded successfully',
      count: promoCodes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding promo codes', error: error.message });
  }
});

module.exports = router;

