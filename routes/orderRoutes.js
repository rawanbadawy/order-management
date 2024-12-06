// routes/orderRoutes.js
const express = require('express');
const { placeOrder, trackOrder, cancelOrder, viewOrderHistory } = require('../controllers/orderController');

const router = express.Router();  // Create an Express router

// Define routes
router.post('/order', placeOrder);
router.get('/order/:orderId/track', trackOrder);
router.put('/order/cancel/:orderId', cancelOrder);
router.get('/orders/history/:userId', viewOrderHistory);

module.exports = router;  // Export the router object
