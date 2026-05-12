import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useCart } from '../context/CartContext';

import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaBoxOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSort,
} from 'react-icons/fa';

export default function ProjectHeader({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
}) {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  // const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: logo + hamburger (mobile) / desktop items */}
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <div
            onClick={() => { navigate('/projects'); closeMobile(); }}
            className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-tight flex-shrink-0"
          >
            ProjectHub
          </div>

          {/* Desktop search, sort, and right menu */}
          <div className="hidden lg:flex flex-1 items-center gap-4">
            {/* Search bar */}
            <div className="flex-1 relative max-w-xl">
              <FaSearch className="absolute left-4 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Sort</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          {/* Desktop right menu (hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-5 text-gray-700">
            <button onClick={() => navigate('/projects')} className="hover:text-blue-600 font-medium transition">
              Projects
            </button>
            <button onClick={() => navigate('/orders')} className="flex items-center gap-1 hover:text-blue-600 transition">
              <FaBoxOpen /> Orders
            </button>
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1 hover:text-blue-600 transition">
              <FaUserCircle /> Profile
            </button>
            <div
              onClick={() => navigate('/cart')}
              className="relative flex items-center gap-1 cursor-pointer hover:text-blue-600 transition"
            >
              <FaShoppingCart size={18} /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-2xl text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 border-t pt-4 flex flex-col gap-4">
            {/* Mobile search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Mobile sort */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Sort by price</option>
                <option value="low-high">Low → High</option>
                <option value="high-low">High → Low</option>
              </select>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1 text-gray-700">
              <button
                onClick={() => { navigate('/projects'); closeMobile(); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                📁 Projects
              </button>
              <button
                onClick={() => { navigate('/orders'); closeMobile(); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <FaBoxOpen /> Orders
              </button>
              <button
                onClick={() => { navigate('/profile'); closeMobile(); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <FaUserCircle /> Profile
              </button>
              <button
                onClick={() => { navigate('/cart'); closeMobile(); }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition relative"
              >
                <FaShoppingCart size={18} /> Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}