import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function Header() {
  const navigate = useNavigate();

  // ✅ get cart from global context
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">

      {/* Logo */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/projects')}
      >
        ProjectHub
      </h1>

      {/* Menu */}
      <div className="flex gap-6 items-center">

        <button onClick={() => navigate('/profile')}>
          Profile
        </button>

        <button onClick={() => navigate('/projects')}>
          Projects
        </button>

        <button onClick={() => navigate('/cart')}>
          Cart ({cartCount})
        </button>

        <button onClick={() => navigate('/orders')}>
          Orders
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>
    </header>
  );
}