const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/stats', getDashboardStats);

// Product routes
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
