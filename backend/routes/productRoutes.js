const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeatured,
  createReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/:id', getProductById);
router.post('/:id/review', protect, createReview);

module.exports = router;
