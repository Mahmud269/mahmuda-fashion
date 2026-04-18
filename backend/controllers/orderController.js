const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc Create order
// @route POST /api/orders
const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, items, itemsPrice, shippingPrice, totalPrice } =
    req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No order items' });

  // Deduct stock
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity)
      return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // Clear cart after order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json(order);
};

// @desc Get logged-in user's orders
// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Get order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin)
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
};

// @desc Mark order as paid
// @route PUT /api/orders/:id/pay
const markAsPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    updateTime: req.body.update_time,
    email: req.body.payer?.email_address,
  };
  order.status = 'processing';
  const updated = await order.save();
  res.json(updated);
};

module.exports = { createOrder, getMyOrders, getOrderById, markAsPaid };
