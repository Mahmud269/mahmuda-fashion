import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-serif text-primary font-bold mb-3">Mahmuda Fashion</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium clothing and cosmetics for the modern lifestyle. Quality you can feel, style you can see.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-primary transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><FiTwitter size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=clothing" className="hover:text-primary transition-colors">Clothing</Link></li>
              <li><Link to="/products?category=cosmetics" className="hover:text-primary transition-colors">Cosmetics</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-white mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
              <li><Link to="/my-orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Dhaka, Bangladesh</li>
              <li>mahmudafashion@email.com</li>
              <li>+880 1XXXXXXXXX</li>
              <li className="text-xs">Mon - Sat: 9am - 8pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mahmuda Fashion. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with MERN Stack</p>
        </div>
      </div>
    </footer>
  );
}
