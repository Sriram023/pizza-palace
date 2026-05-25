
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

exports.create = async (req, res) => {
  const { items, deliveryAddress } = req.body;

  // Recompute prices server-side from DB (never trust client totals)
  const pizzaIds = items.map((i) => i.pizza);
  const pizzas = await Pizza.find({ _id: { $in: pizzaIds } });
  const pizzaMap = new Map(pizzas.map((p) => [p._id.toString(), p]));

  const sizeMultiplier = { Small: 0.85, Medium: 1, Large: 1.2 };

  const orderItems = items.map((i) => {
    const p = pizzaMap.get(i.pizza);
    if (!p) throw Object.assign(new Error(`Pizza ${i.pizza} not found`), { status: 400 });
    if (!p.isAvailable) throw Object.assign(new Error(`${p.name} is unavailable`), { status: 400 });
    const mult = sizeMultiplier[i.size] || 1;
    return {
      pizza: p._id,
      name: p.name,
      size: i.size || 'Medium',
      qty: i.qty,
      priceAtOrder: Math.round(p.price * mult * 100) / 100,
    };
  });

  const subtotal = orderItems.reduce((s, i) => s + i.priceAtOrder * i.qty, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const totalAmount = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

  const order = await Order.create({
    customerId: req.user._id,
    items: orderItems,
    totalAmount,
    deliveryAddress,
  });

  res.status(201).json({ order });
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
};

exports.allOrders = async (_req, res) => {
  const orders = await Order.find()
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ orders });
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!Order.ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
};

exports.remove = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ message: 'Order deleted' });
};
exports.cancelOrder = async (req, res, next) => {

  try {

    const Order = require('../models/Order');

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    // only pending orders
    if (order.status !== 'Pending') {
      return res.status(400).json({
        message: 'Only pending orders can be cancelled',
      });
    }

    order.status = 'Cancelled';

    await order.save();

    res.json({
      success: true,
      order,
    });

  } catch (err) {

    next(err);
  }
};