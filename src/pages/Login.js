import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import localImage from '../images/img.png';


export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', form);
      const { token, user } = res.data;
      const role = user.role;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/projects', { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono px-4 overflow-hidden">
      
      {/* Hacker Icon */}
      <div className="absolute top-10 left-10 text-6xl animate-pulse">
          <img src={localImage} alt="hacker logo" width={400} height={400} />
      </div>

      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-green-500">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wider text-green-300">
          PROJECT GUID LOGIN
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-green-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-black text-green-300 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-500"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-green-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-black text-green-300 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition shadow-lg"
          >
            Access System
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-300">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-400 hover:underline">
            Create Identity
          </Link>
        </p>

        {/* Fake terminal animation */}
        <div className="mt-6 text-sm text-green-500 text-center animate-pulse">
          &gt; authenticating user...
        </div>
      </div>
    </div>
  );
}