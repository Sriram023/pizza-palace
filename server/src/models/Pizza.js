const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Specialty'],
      required: true,
    },
    imageUrl: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', pizzaSchema);