import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const image = product.images?.[0] || '/placeholder.jpg';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group card hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1 capitalize">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-800 truncate mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-xs text-gray-600">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
