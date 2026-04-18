const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc Get user cart
// @route GET /api/cart
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name price discountPrice images stock'
  );
  res.json(cart || { items: [] });
};

// @desc Add item to cart
// @route POST /api/cart
const addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < quantity)
    return res.status(400).json({ message: 'Not enough stock' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingIndex = cart.items.findIndex(
    (i) => i.product.toString() === productId && i.size === size && i.color === color
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, size: size || '', color: color || '' });
  }

  await cart.save();
  const populated = await cart.populate('items.product', 'name price discountPrice images stock');
  res.json(populated);
};

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.quantity = quantity;
  await cart.save();
  const populated = await cart.populate('items.product', 'name price discountPrice images stock');
  res.json(populated);
};

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  const populated = await cart.populate('items.product', 'name price discountPrice images stock');
  res.json(populated);
};

// @desc Clear cart
// @route DELETE /api/cart
const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
