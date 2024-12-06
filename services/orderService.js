const Order = require('../models/order');

// Create a new order
const createOrder = async (orderData) => {
  try {
    const order = new Order(orderData);
    return await order.save();
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Track an existing order by ID
const trackOrderById = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Calculate expected delivery time using the helper function
      const expectedDeliveryTime = calculateExpectedDeliveryTime(order);
  
      res.status(200).json({
        order,
        status: order.status,
        expectedDeliveryTime,  // Include the calculated expected delivery time
      });
    } catch (error) {
      res.status(500).json({ message: 'Error tracking the order', error });
    }
  };
  
  // Helper function to calculate expected delivery time (1 hour after order placement)
  const calculateExpectedDeliveryTime = (order) => {
    const placedAt = new Date(order.placedAt);
    const deliveryTime = new Date(placedAt.getTime() + 60 * 60 * 1000); // Add 1 hour for delivery
    return deliveryTime.toISOString();  // Return as ISO string
  };

// Cancel an order
const cancelOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if the user is authorized to cancel this order
    if (order.userId.toString() !== userId) {
      throw new Error('Unauthorized: Cannot cancel someone else’s order');
    }

    // Check if the order was placed more than 15 minutes ago
    const currentTime = new Date();
    const placedAt = new Date(order.placedAt);
    const timeDifference = currentTime - placedAt;

    if (timeDifference > 15 * 60 * 1000) {
      throw new Error('Order can no longer be canceled (after 15 minutes)');
    }

    // Update order status to 'Cancelled'
    order.status = 'Cancelled';
    await order.save();
    return { message: 'Order canceled successfully', order };
  } catch (error) {
    throw new Error(`Error canceling order: ${error.message}`);
  }
};

// Get order history for a user
const getOrderHistory = async (userId) => {
  try {
    const orders = await Order.find({ userId }).sort({ placedAt: -1 });
    if (!orders.length) {
      throw new Error('No orders found');
    }
    return orders;
  } catch (error) {
    throw new Error(`Error fetching order history: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  trackOrderById,
  cancelOrderById,
  getOrderHistory,
};
