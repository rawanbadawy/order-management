const { validateOrderInput } = require('../utils/validation');
const {
  createOrder,
  //trackOrder,
  cancelOrderById,
  getOrderHistory,
} = require('../services/orderService');
const Order = require('../models/order'); // Adjust the path as needed
console.log(Order); // This should log the Order model object

// Place Order, satisfie the single responsibility principle, it handles only the placement of the order
//the same with cancel,track and view history all of them has one responsibility only
const placeOrder = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { error } = validateOrderInput(req.body);
    if (error) {
      console.error('Validation Error:', error.details);
      return res.status(400).json({ message: error.details[0].message });
    }

    const savedOrder = await createOrder(req.body);
    console.log('Order Saved:', savedOrder);
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (err) {
    console.error('Error in placeOrder:', err.message);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

// Track Order

const trackOrder = async (req, res) => {
  const { orderId } = req.params;  // Extract orderId from the request parameters

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate expected delivery time (e.g., 1 hour after order placement)
    const expectedDeliveryTime = calculateExpectedDeliveryTime(order);

    // Return only the status and expected delivery time
    return res.status(200).json({
      status: order.status,
      expectedDeliveryTime,
    });
  } catch (error) {
    console.error('Error tracking the order:', error);  // Log the error for debugging
    return res.status(500).json({ message: 'Error tracking the order', error: error.message || error });
  }
};

// Helper function to calculate expected delivery time (1 hour after order placement)
const calculateExpectedDeliveryTime = (order) => {
  const placedAt = new Date(order.placedAt);  // The time when the order was placed
  const deliveryTime = new Date(placedAt.getTime() + 60 * 60 * 1000);  // Add 1 hour
  return deliveryTime.toISOString();  // Return as ISO string
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const updatedOrder = await cancelOrderById(orderId, userId);
    res.status(200).json({ message: 'Order Cancelled Successfully', order: updatedOrder });
  } catch (err) {
    console.error('Error in cancelOrder:', err.message);
    res.status(500).json({ message: err.message || 'Order can no longer be canceled (after 15 minutes)' });
  }
};

// View Order History
const viewOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await getOrderHistory(userId);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error('Error in viewOrderHistory:', err.message);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

module.exports = { placeOrder, trackOrder, cancelOrder, viewOrderHistory };