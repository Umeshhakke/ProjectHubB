// components/admin/AdminHeader.js
import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function AdminHeader() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestRequests, setLatestRequests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchUnread = async () => {
    try {
      const { data } = await API.get('/admin/unread-count');
      setUnreadCount(data.unreadRequests);

      // Optionally fetch the 3 most recent unread requests
      const res = await API.get('/project-requests/admin?unread=true&limit=3');
      setLatestRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Bell icon */}
      <div className="relative">
        <button
          className="text-2xl"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          🔔
        </button>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto z-50">
            <h3 className="text-sm font-bold mb-2">Unread Requests</h3>
            {latestRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No new requests</p>
            ) : (
              latestRequests.map(req => (
                <div key={req._id} className="border-b py-1 text-sm">
                  <p className="font-medium">{req.title}</p>
                  <p className="text-gray-500 text-xs">by {req.userId?.name || 'User'}</p>
                </div>
              ))
            )}
            <button
              onClick={() => { /* navigate to full requests page */ }}
              className="mt-2 w-full text-blue-600 text-sm hover:underline"
            >
              View all requests
            </button>
          </div>
        )}
      </div>
      {/* ... other admin header items ... */}
    </div>
  );
}