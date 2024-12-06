const Joi = require('joi');
//validation using Joi in declarative programming, this focuses on what should be done not how it should be done
// Validation schema for placing an order
const orderSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required(),
    })
  ).required(),
  totalPrice: Joi.number().min(0).required(),
  deliveryAddress: Joi.string().required(),
  customerDetails: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
  }).required(),
  paymentMethod: Joi.string().required(),
  specialInstructions: Joi.string().optional(),
  promoCode: Joi.string().optional(),
});

// Export the validation function
const validateOrderInput = (data) => {
  return orderSchema.validate(data);
};

module.exports = { validateOrderInput };
