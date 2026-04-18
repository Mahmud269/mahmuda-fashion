import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-serif font-bold text-primary tracking-wide">
              Mahmuda Fashion
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
            <Link to="/products?category=clothing" className="hover:text-primary transition-colors">Clothing</Link>
            <Link to="/products?category=cosmetics" className="hover:text-primary transition-colors">Cosmetics</Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-1.5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent text-sm outline-none text-white placeholder-gray-400 w-40"
            />
            <button type="submit" className="text-gray-400 hover:text-primary ml-2">
              <FiSearch size={16} />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-primary transition-colors">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FiUser size={22} />
                  <span className="hidden md:block text-sm">{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <FiUser size={16} /> Profile
                    </Link>
                    <Link to="/my-orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-primary font-semibold">
                        <FiSettings size={16} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-primary transition-colors">
                <FiUser size={22} />
              </Link>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden hover:text-primary">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm outline-none text-white placeholder-gray-400 flex-1"
              />
              <button type="submit"><FiSearch size={16} className="text-gray-400" /></button>
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-primary">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-primary">All Products</Link>
            <Link to="/products?category=clothing" onClick={() => setMenuOpen(false)} className="hover:text-primary">Clothing</Link>
            <Link to="/products?category=cosmetics" onClick={() => setMenuOpen(false)} className="hover:text-primary">Cosmetics</Link>
            {user && <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="hover:text-primary">My Orders</Link>}
          </div>
        )}
      </div>
    </nav>
  );
}
