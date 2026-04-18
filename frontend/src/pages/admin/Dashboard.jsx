import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import { FiShoppingBag, FiUsers, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingCart, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: FiShoppingBag, color: 'text-primary bg-primary/10' },
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-outline text-sm py-2">Manage Products</Link>
          <Link to="/admin/orders" className="btn-primary text-sm py-2">Manage Orders</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary hover:underline text-sm">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono">{order._id.slice(-8)}</td>
                  <td className="px-4 py-3 text-sm">{order.user?.name}</td>
                  <td className="px-4 py-3 text-sm">{order.items.length}</td>
                  <td className="px-4 py-3 text-sm font-semibold">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Add New Product', to: '/admin/products/add', primary: true },
          { label: 'Manage Users', to: '/admin/users', primary: false },
          { label: 'View Store', to: '/', primary: false },
        ].map(({ label, to, primary }) => (
          <Link key={label} to={to} className={`${primary ? 'btn-primary' : 'btn-outline'} text-center py-3`}>{label}</Link>
        ))}
      </div>
    </div>
  );
}
