import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import Header from '../components/Header';

function MyRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    API.get('/project-requests/my')
      .then(res => setRequests(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleUserResponse = async (id, action) => {
    try {
      await API.put(`/project-requests/${id}/respond`, { action });
      fetchRequests();
      alert(`Offer ${action}ed successfully!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        No project requests submitted yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {requests.map(req => (
        <div
          key={req._id}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 flex flex-col"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-800 flex-1 pr-2">{req.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                req.status === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : req.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : req.status === 'negotiation'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {req.status}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{req.description}</p>

          <div className="mt-auto space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Budget:</span>
              <span className="font-medium">₹{req.budget || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Deadline:</span>
              <span className="font-medium">{req.deadline || 'N/A'}</span>
            </div>

            {req.status === 'negotiation' && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-yellow-800 font-medium text-sm">
                  Admin counter‑price: ₹{req.adminPrice}
                </p>
                {req.adminNotes && (
                  <p className="text-gray-600 text-xs mt-1 italic">“{req.adminNotes}”</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUserResponse(req._id, 'accept')}
                    className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                  >
                    Accept Offer
                  </button>
                  <button
                    onClick={() => handleUserResponse(req._id, 'reject')}
                    className="flex-1 bg-white border border-red-300 text-red-600 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                  >
                    Reject Offer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const userId = getUserId();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.log(err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const updateProfile = async () => {
    try {
      await API.put('/auth/update', { name, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Profile updated successfully!');
      setEditMode(false);
      setUser({ ...user, name, email });
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User info & edit form */}
              <div className="flex-1 w-full">
                {!editMode ? (
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-400 capitalize">{user.role || 'User'}</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={updateProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Project Requests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Project Requests</h2>
            <MyRequests />
          </div>
        </div>
      </div>
    </>
  );
}