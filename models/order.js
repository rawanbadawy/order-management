const mongoose = require('mongoose');
//Object-oriented programming, since order data are inside a class-like structure (mongoose.Schema) where orders can be created and manipulated 

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  deliveryAddress: { type: String, required: true },
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, match: /\S+@\S+\.\S+/ },
    phoneNumber: { type: String, required: true, match: /^\+?\d{10,15}$/ },
  },
  paymentMethod: { type: String, required: true },
  specialInstructions: { type: String },
  promoCode: { type: String },
  placedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
