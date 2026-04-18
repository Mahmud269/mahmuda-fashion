import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { FiTrash2, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    axios.get('/api/admin/users')
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("You can't delete your own account");
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold mb-6">Manage Users</h1>
      <p className="text-gray-500 mb-6">{users.length} registered users</p>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Joined', 'Role', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.isAdmin ? (
                      <span className="flex items-center gap-1 text-primary text-sm font-semibold">
                        <FiShield size={14} /> Admin
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Customer</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u._id !== currentUser._id && !u.isAdmin && (
                      <button onClick={() => handleDelete(u._id)} className="text-red-400 hover:text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                    )}
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
