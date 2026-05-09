import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useCart } from '../context/CartContext';

import {
  FaUserCircle,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
  FaThLarge,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setMobileOpen(false);
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const desktopNavClass = (path) =>
    `flex items-center gap-1 px-2 py-1 rounded-md transition ${
      isActive(path)
        ? 'bg-white text-blue-600 font-semibold'
        : 'hover:text-gray-200'
    }`;

  const mobileNavClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive(path)
        ? 'bg-blue-700 text-white font-semibold'
        : 'hover:bg-blue-700 hover:text-white'
    }`;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: logo + hamburger (mobile) */}
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => handleNav('/projects')}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="bg-white text-blue-600 px-2 py-1 rounded font-bold text-sm sm:text-base">
              PH
            </div>
            <h1 className="text-lg sm:text-xl font-semibold whitespace-nowrap">
              ProjectHub
            </h1>
          </div>

          {/* Desktop nav (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
            <button onClick={() => handleNav('/profile')} className={desktopNavClass('/profile')}>
              <FaUserCircle /> Profile
            </button>
            <button onClick={() => handleNav('/projects')} className={desktopNavClass('/projects')}>
              <FaThLarge /> Projects
            </button>
            <button onClick={() => handleNav('/cart')} className={`relative ${desktopNavClass('/cart')}`}>
              <FaShoppingCart /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => handleNav('/orders')} className={desktopNavClass('/orders')}>
              <FaBoxOpen /> Orders
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-2xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-1 text-sm border-t border-blue-400 pt-4">
            <button onClick={() => handleNav('/profile')} className={mobileNavClass('/profile')}>
              <FaUserCircle /> Profile
            </button>
            <button onClick={() => handleNav('/projects')} className={mobileNavClass('/projects')}>
              <FaThLarge /> Projects
            </button>
            <button onClick={() => handleNav('/cart')} className={`relative ${mobileNavClass('/cart')}`}>
              <FaShoppingCart /> Cart
              {cartCount > 0 && (
                <span className="ml-auto bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => handleNav('/orders')} className={mobileNavClass('/orders')}>
              <FaBoxOpen /> Orders
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition mt-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}