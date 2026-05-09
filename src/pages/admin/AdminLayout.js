import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/requests', label: 'Project Requests' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    // Optionally clear any other stored user data
    localStorage.removeItem('user');
    // Redirect to login page (or home)
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 hidden md:flex md:flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded hover:bg-gray-700 transition ${
                isActive(item.to, item.exact) ? 'bg-gray-700' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Sign Out button at the bottom */}
        <button
          onClick={handleSignOut}
          className="mt-auto w-full px-3 py-2 text-left rounded hover:bg-red-600 transition text-red-300 hover:text-white"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}