import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FiEdit2, FiTrash2, FiPlus, FiStar } from 'react-icons/fi';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    axios.get('/api/products?limit=100')
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await axios.put(`/api/admin/products/${product._id}`, { featured: !product.featured });
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, featured: !p.featured } : p));
      toast.success(`${product.featured ? 'Removed from' : 'Added to'} featured`);
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Manage Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={p.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm max-w-[200px] truncate">{p.name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-yellow-500' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(p)} title="Toggle Featured">
                      <FiStar size={18} className={p.featured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/products/edit/${p._id}`} className="text-blue-500 hover:text-blue-700">
                        <FiEdit2 size={18} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
