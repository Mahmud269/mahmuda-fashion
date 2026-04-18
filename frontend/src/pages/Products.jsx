import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['all', 'clothing', 'cosmetics', 'accessories'];
const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('limit', 12);

    setLoading(true);
    axios.get(`/api/products?${params.toString()}`)
      .then(({ data }) => {
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [search, category, sort, page, minPrice, maxPrice]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
          </h1>
          {search && <p className="text-gray-500 mt-1">Results for "{search}" — {total} items</p>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 md:hidden border border-gray-300 px-4 py-2 rounded-lg">
          <FiFilter size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <div className="bg-white rounded-xl shadow p-6 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="md:hidden"><FiX /></button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Category</h3>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === (cat === 'all' ? '' : cat)}
                    onChange={() => setParam('category', cat === 'all' ? '' : cat)}
                    className="accent-primary"
                  />
                  <span className="capitalize text-sm">{cat}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setParam('minPrice', e.target.value)}
                  className="input-field text-sm py-1.5"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setParam('maxPrice', e.target.value)}
                  className="input-field text-sm py-1.5"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Sort By</h3>
              {SORTS.map((s) => (
                <label key={s.value} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={sort === s.value}
                    onChange={() => setParam('sort', s.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 mb-4">No products found</p>
              <p className="text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-4 text-sm">{total} products found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setParam('page', p > 1 ? p : '')}
                      className={`w-10 h-10 rounded-lg font-medium ${page === p ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:border-primary'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
