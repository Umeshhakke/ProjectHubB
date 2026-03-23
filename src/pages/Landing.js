import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      <h1 className="text-5xl font-bold mb-6 text-center">Welcome to Project Marketplace</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Browse and purchase student projects easily. Get access to source code instantly after checkout.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Signup
        </Link>
      </div>
      <footer className="mt-20 text-sm opacity-80">
        &copy; 2026 Student Project Marketplace
      </footer>
    </div>
  );
}