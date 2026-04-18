import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Order not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold">Order Details</h1>
        <Link to="/my-orders" className="text-primary hover:underline text-sm">← Back to Orders</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Order Items</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <p className="text-gray-600 text-sm">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}<br />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl shadow p-6 space-y-3">
            <h2 className="font-semibold mb-2">Order Summary</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold border-t pt-3"><span>Total</span><span>${order.totalPrice?.toFixed(2)}</span></div>
            <div className="pt-2 text-sm text-gray-600">
              <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
              <p><strong>Paid:</strong> {order.isPaid ? `Yes - ${new Date(order.paidAt).toLocaleDateString()}` : 'No'}</p>
            </div>
            <p className="text-xs text-gray-400">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
