import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/admin/users').then(res => setUsers(res.data)).catch(console.error);
    API.get('/admin/projects').then(res => setProjects(res.data)).catch(console.error);
    API.get('/admin/orders').then(res => setOrders(res.data)).catch(console.error);
  }, []);
  useEffect(() => {
    const updateBadge = async () => {
      try {
        const { data } = await API.get('/admin/unread-count');
        if (navigator.setAppBadge) {
          await navigator.setAppBadge(data.unreadRequests);
        }
      } catch (err) {
        console.error('Badge error', err);
      }
    };
    updateBadge();
    const interval = setInterval(updateBadge, 10000); // every 10 sec
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded text-center">
          <h2 className="text-3xl font-bold">{users.length}</h2>
          <p>Total Users</p>
        </div>
        <div className="bg-white p-6 shadow rounded text-center">
          <h2 className="text-3xl font-bold">{projects.length}</h2>
          <p>Total Projects</p>
        </div>
        <div className="bg-white p-6 shadow rounded text-center">
          <h2 className="text-3xl font-bold">{orders.length}</h2>
          <p>Total Orders</p>
        </div>
      </div>
    </div>
  );
}