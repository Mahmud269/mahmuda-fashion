import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    if (product.sizes?.length > 0 && !selectedSize)
      return toast.error('Please select a size');
    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setReviewLoading(true);
    try {
      await axios.post(`/api/products/${id}/review`, review);
      toast.success('Review submitted!');
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/600x600?text=No+Image'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
        <FiArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${i === selectedImage ? 'border-primary' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-2 capitalize">{product.category}</p>
          <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} size={16} className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            {product.discountPrice > 0 && (
              <span className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <p className="font-medium mb-2">Size:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${selectedSize === s ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="font-medium mb-2">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-primary scale-110' : 'border-gray-300'}`}
                    style={{ backgroundColor: c.toLowerCase() }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-medium">Quantity:</p>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:text-primary"><FiMinus /></button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:text-primary"><FiPlus /></button>
            </div>
            <span className="text-gray-500 text-sm">{product.stock} in stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart size={20} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Review List */}
          <div>
            {product.reviews?.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((r) => (
                  <div key={r._id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{r.name}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <FiStar key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                    <p className="text-gray-400 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}
          {user && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleReview} className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} type="button" onClick={() => setReview({ ...review, rating: s })}>
                        <FiStar size={24} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-2">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    rows={4}
                    required
                    className="input-field resize-none"
                    placeholder="Share your experience..."
                  />
                </div>
                <button type="submit" disabled={reviewLoading} className="btn-primary w-full">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
