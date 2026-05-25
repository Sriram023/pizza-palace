const Pizza = require('../models/Pizza');

exports.list = async (req, res) => {
  const { search, category, available } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (available === 'true') filter.isAvailable = true;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
  res.json({ pizzas });
};

exports.get = async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);
  if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
  res.json({ pizza });
};

exports.create = async (req, res) => {
  const pizza = await Pizza.create(req.body);
  res.status(201).json({ pizza });
};

exports.update = async (req, res) => {
  const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
  res.json({ pizza });
};

exports.remove = async (req, res) => {
  const pizza = await Pizza.findByIdAndDelete(req.params.id);
  if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
  res.json({ message: 'Pizza deleted' });
};