const Product = require('../models/Product');

// @desc Get all products with search, filter, pagination
// @route GET /api/products
const getProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};

  const filters = { ...keyword, ...categoryFilter, ...minPrice, ...maxPrice };

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc Get single product
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @desc Get featured products
// @route GET /api/products/featured
const getFeatured = async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json(products);
};

// @desc Create product review
// @route POST /api/products/:id/review
const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed)
    return res.status(400).json({ message: 'Product already reviewed' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
};

module.exports = { getProducts, getProductById, getFeatured, createReview };
