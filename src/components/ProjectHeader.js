import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useCart } from '../context/CartContext';

import { 
  FaSearch, 
  FaShoppingCart, 
  FaUserCircle, 
  FaBoxOpen, 
  FaSignOutAlt 
} from 'react-icons/fa';

export default function ProjectHeader({
  search,
  setSearch,
  sortOrder,
  setSortOrder
}) {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">

        {/* 🔷 LOGO */}
        <div
          onClick={() => navigate('/projects')}
          className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-tight"
        >
          ProjectHub
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="flex-1 relative hidden md:block">
          <FaSearch className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search for projects, AI, ML, React..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
          />
        </div>

        {/* 🔃 SORT */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="hidden md:block px-3 py-2 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Sort</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

        {/* 🔹 RIGHT MENU */}
        <div className="flex items-center gap-5 text-gray-700">

          {/* PROJECTS */}
          <button
            onClick={() => navigate('/projects')}
            className="hover:text-blue-600 font-medium transition"
          >
            Projects
          </button>

          {/* ORDERS */}
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <FaBoxOpen />
            Orders
          </button>

          {/* PROFILE */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <FaUserCircle />
            Profile
          </button>

          {/* CART */}
          <div
            onClick={() => navigate('/cart')}
            className="relative flex items-center gap-1 cursor-pointer hover:text-blue-600 transition"
          >
            <FaShoppingCart size={18} />
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}