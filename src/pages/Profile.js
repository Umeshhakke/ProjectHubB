import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import Header from '../components/Header';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const userId = getUserId();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/auth/me/${userId}`);
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  // Update profile
  const updateProfile = async () => {
    try {
      await API.put(`/auth/update/${userId}`, { name, email });
      alert('Profile updated successfully!');
      setEditMode(false);

      // update UI instantly
      setUser({ ...user, name, email });

    } catch (err) {
      alert('Update failed');
    }
  };

  if (!user) {
    return <p className="text-center mt-20">Loading profile...</p>;
  }

  return (
    <>
      <Header />

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow w-96">

          <h1 className="text-2xl font-bold mb-6 text-center">
            My Profile
          </h1>

          <div className="space-y-4">

            {/* NAME */}
            <div>
              <p className="text-gray-500">Name</p>
              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <p className="font-semibold">{user.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <p className="text-gray-500">Email</p>
              {editMode ? (
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <p className="font-semibold">{user.email}</p>
              )}
            </div>

            {/* BUTTONS */}
            {editMode ? (
              <button
                onClick={updateProfile}
                className="w-full py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="w-full py-2 bg-blue-600 text-white rounded"
              >
                Edit Profile
              </button>
            )}

          </div>
        </div>
      </div>
    </>
  );
}