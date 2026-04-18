const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['clothing', 'cosmetics', 'accessories'],
    },
    subCategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
