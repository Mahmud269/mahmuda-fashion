import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, cartTotal } = useCart();

  if (loading) return <Loader />;

  const items = cart.items || [];
  const shipping = cartTotal >= 50 ? 0 : 5;
  const total = cartTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <FiShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const handleUpdate = async (itemId, qty) => {
    try { await updateItem(itemId, qty); }
    catch { toast.error('Failed to update'); }
  };

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId); toast.success('Item removed'); }
    catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const p = item.product;
            const price = p?.discountPrice > 0 ? p.discountPrice : p?.price || 0;
            return (
              <div key={item._id} className="card p-4 flex gap-4">
                <img
                  src={p?.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={p?.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${p?._id}`} className="font-semibold text-gray-800 hover:text-primary truncate block">
                    {p?.name}
                  </Link>
                  {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                  {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                  <p className="text-primary font-bold mt-1">${price.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button onClick={() => handleUpdate(item._id, Math.max(1, item.quantity - 1))} className="px-2 py-1 hover:text-primary"><FiMinus size={14} /></button>
                      <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => handleUpdate(item._id, item.quantity + 1)} className="px-2 py-1 hover:text-primary"><FiPlus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">${(price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => handleRemove(item._id)} className="text-red-400 hover:text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl shadow p-6 sticky top-20">
            <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">Add ${(50 - cartTotal).toFixed(2)} more for free shipping</p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mt-6 py-3">
              Proceed to Checkout <FiArrowRight size={18} />
            </Link>
            <Link to="/products" className="text-center block mt-3 text-primary hover:underline text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
