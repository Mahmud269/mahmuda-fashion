import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: data.status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold mb-6">Manage Orders</h1>
      <p className="text-gray-500 mb-6">{orders.length} total orders</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <div>
                <p className="text-xs text-gray-500 font-mono">{order._id}</p>
                <p className="font-semibold">{order.user?.name}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Items</p>
                <p className="font-semibold">{order.items.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
              </div>
              <div>
                <select
                  value={order.status}
                  onChange={(e) => { e.stopPropagation(); updateStatus(order._id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            {expanded === order._id && (
              <div className="border-t p-5 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 mb-2">
                        <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-500">x{item.quantity} @ ${item.price.toFixed(2)}</p>
                        </div>
                        <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                    <p className="mt-3 text-sm"><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
                    <p className="text-sm"><strong>Paid:</strong> {order.isPaid ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
