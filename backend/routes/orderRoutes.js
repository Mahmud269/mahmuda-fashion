const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  markAsPaid,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', markAsPaid);

module.exports = router;
