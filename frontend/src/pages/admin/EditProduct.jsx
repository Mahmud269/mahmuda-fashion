import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';
import Loader from '../../components/Loader';

const CATEGORIES = ['clothing', 'cosmetics', 'accessories'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(({ data }) => {
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice || 0,
        category: data.category,
        subCategory: data.subCategory || '',
        brand: data.brand || '',
        stock: data.stock,
        featured: data.featured,
        tags: data.tags?.join(', ') || '',
        sizes: data.sizes?.join(', ') || '',
        colors: data.colors?.join(', ') || '',
        images: data.images || [],
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await axios.put(`/api/admin/products/${id}`, payload);
      toast.success('Product updated!');
      navigate('/admin/products');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading || !form) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price ($)</label>
            <input type="number" step="0.01" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
            <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input-field" placeholder="S, M, L, XL" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
            <input type="text" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="input-field" placeholder="red, blue" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary w-4 h-4" />
            <label htmlFor="featured" className="text-sm font-medium">Featured</label>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={img} alt="" className="w-full h-full object-cover rounded-lg" onError={(e) => { e.target.src = 'https://via.placeholder.com/96'; }} />
                <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-4 transition-colors">
            <FiUpload className="text-gray-400" />
            <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to add more images'}</span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline flex-1 py-3">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
