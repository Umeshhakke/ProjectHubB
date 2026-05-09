import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/admin/orders').then(res => setOrders(res.data)).catch(console.error);
  }, []);

  const updateOrder = async (id, status) => {
    try {
      await API.put(`/admin/order/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Project</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-3">{o.user_name}</td>
                <td className="p-3">{o.project_name}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={e => updateOrder(o._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}