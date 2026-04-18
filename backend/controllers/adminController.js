const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// --- Product Management ---
const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

// --- Order Management ---
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }
  const updated = await order.save();
  res.json(updated);
};

// --- User Management ---
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

// --- Dashboard Stats ---
const getDashboardStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalProducts,
    totalUsers,
    recentOrders,
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser,
  getDashboardStats,
};
