import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products/featured')
      .then(({ data }) => setFeatured(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-dark text-white min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600')" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-primary font-semibold tracking-widest uppercase mb-3">New Collection 2024</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
            Elevate Your<br />
            <span className="text-primary">Style</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Discover premium clothing and cosmetics curated for the modern lifestyle. Quality you can feel, style you can see.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              Shop Now
            </Link>
            <Link to="/products?category=cosmetics" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-dark">
              Explore Cosmetics
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Clothing', query: 'clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600', desc: 'Trendy outfits for every occasion' },
            { name: 'Cosmetics', query: 'cosmetics', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', desc: 'Beauty products that enhance your look' },
            { name: 'Accessories', query: 'accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', desc: 'Complete your style with the right accessories' },
          ].map((cat) => (
            <Link key={cat.query} to={`/products?category=${cat.query}`} className="group relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-serif font-bold">{cat.name}</h3>
                <p className="text-sm text-gray-300 mt-1">{cat.desc}</p>
                <span className="flex items-center gap-1 mt-2 text-primary font-semibold text-sm">
                  Shop Now <FiArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif">Featured Products</h2>
            <Link to="/products" className="flex items-center gap-1 text-primary hover:underline font-semibold">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <Loader />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No featured products yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: FiShield, title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated customer care' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-primary/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Join Mahmuda Fashion</h2>
          <p className="text-gray-600 mb-8 text-lg">Create an account to track orders, save favorites, and get exclusive offers.</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-3">
            Sign Up Free
          </Link>
        </div>
      </section>
    </div>
  );
}
