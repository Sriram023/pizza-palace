const router = require('express').Router();

const Razorpay = require('razorpay');

const crypto = require('crypto');

const auth = require('../middleware/auth');

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE ORDER
router.post('/create-order', auth, async (req, res) => {

  try {

    const { amount } = req.body;

    const options = {

      amount: Math.round(amount * 100),

      currency: 'INR',

      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Failed to create Razorpay order',
    });
  }
});

// VERIFY PAYMENT
router.post('/verify', auth, async (req, res) => {

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

    } = req.body;

    const sign = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
          '|' +
          razorpay_payment_id
      )
      .digest('hex');

    if (sign !== razorpay_signature) {

      return res.status(400).json({
        message: 'Invalid signature',
      });
    }

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: 'Verification failed',
    });
  }
});

module.exports = router;