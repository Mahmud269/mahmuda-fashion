import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function OrderSuccess() {
  const { id } = useParams();
  const { fetchCart } = useCart();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FiCheckCircle size={80} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold mb-3">Order Placed!</h1>
        <p className="text-gray-600 mb-2">
          Thank you for shopping at Mahmuda Fashion. Your order has been received.
        </p>
        <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono text-gray-600">{id}</span></p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/orders/${id}`} className="btn-primary px-8 py-3">View Order</Link>
          <Link to="/products" className="btn-outline px-8 py-3">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
