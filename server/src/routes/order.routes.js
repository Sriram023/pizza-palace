const router = require('express').Router();

const { body } = require('express-validator');

const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const ctrl = require('../controllers/order.controller');

router.post(
  '/',
  auth,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.pizza').isMongoId(),
    body('items.*.qty').isInt({ min: 1 }),
    body('items.*.size')
      .optional()
      .isIn(['Small', 'Medium', 'Large']),

    body('deliveryAddress.fullName')
      .trim()
      .notEmpty(),

    body('deliveryAddress.phone')
      .trim()
      .notEmpty(),

    body('deliveryAddress.line1')
      .trim()
      .notEmpty(),

    body('deliveryAddress.city')
      .trim()
      .notEmpty(),

    body('deliveryAddress.pincode')
      .trim()
      .notEmpty(),
  ],

  validate,

  ctrl.create
);

/* USER ORDERS */
router.get('/my', auth, ctrl.myOrders);

/* CANCEL ORDER */
router.patch('/:id/cancel', auth, ctrl.cancelOrder);

/* ADMIN */
router.get('/', auth, admin, ctrl.allOrders);

router.put(
  '/:id/status',
  auth,
  admin,
  ctrl.updateStatus
);

router.delete(
  '/:id',
  auth,
  admin,
  ctrl.remove
);

module.exports = router;