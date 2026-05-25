const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().isLength({ max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6, max: 100 }),
  ],
  validate,
  ctrl.register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  ctrl.login
);

router.get('/profile', auth, ctrl.profile);
router.put(
  '/profile',
  auth,
  [
    body('name').optional().trim().isLength({ min: 1, max: 80 }),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  validate,
  ctrl.updateProfile
);

module.exports = router;