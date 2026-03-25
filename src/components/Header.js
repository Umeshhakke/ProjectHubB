import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useCart } from '../context/CartContext';

import {
  FaUserCircle,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
  FaThLarge
} from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ current route
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // ✅ helper for active style
  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `flex items-center gap-1 px-2 py-1 rounded-md transition ${
      isActive(path)
        ? 'bg-white text-blue-600 font-semibold'
        : 'hover:text-gray-200'
    }`;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-white text-blue-600 px-2 py-1 rounded font-bold">
            PH
          </div>
          <h1 className="text-xl font-semibold">ProjectHub</h1>
        </div>

        {/* MENU */}
        <div className="flex items-center gap-6 text-sm">

          <button onClick={() => navigate('/profile')} className={navClass('/profile')}>
            <FaUserCircle /> Profile
          </button>

          <button onClick={() => navigate('/projects')} className={navClass('/projects')}>
            <FaThLarge /> Projects
          </button>

          <button
            onClick={() => navigate('/cart')}
            className={`relative ${navClass('/cart')}`}
          >
            <FaShoppingCart /> Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => navigate('/orders')} className={navClass('/orders')}>
            <FaBoxOpen /> Orders
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition"
          >
            <FaSignOutAlt /> Logout
          </button>

        </div>
      </div>
    </header>
  );
}