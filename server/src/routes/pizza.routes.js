const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const ctrl = require('../controllers/pizza.controller');

const pizzaValidators = (optional = false) => [
  body('name')[optional ? 'optional' : 'exists']().trim().notEmpty().isLength({ max: 100 }),
  body('description')[optional ? 'optional' : 'exists']().trim().notEmpty().isLength({ max: 500 }),
  body('price')[optional ? 'optional' : 'exists']().isFloat({ min: 0 }),
  body('category')[optional ? 'optional' : 'exists']().isIn(['Veg', 'Non-Veg', 'Specialty']),
  body('imageUrl')[optional ? 'optional' : 'exists']().isURL(),
  body('isAvailable').optional().isBoolean(),
];

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', auth, admin, pizzaValidators(false), validate, ctrl.create);
router.put('/:id', auth, admin, pizzaValidators(true), validate, ctrl.update);
router.delete('/:id', auth, admin, ctrl.remove);

module.exports = router;