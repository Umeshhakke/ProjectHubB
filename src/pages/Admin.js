import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Header from '../components/Header';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const BASE_URL = "https://projecthub-397q.onrender.com";

  // Add project form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const u = await API.get('/admin/users');
      const p = await API.get('/admin/projects');
      const o = await API.get('/admin/orders');

      setUsers(u.data);
      setProjects(p.data);
      setOrders(o.data);
    } catch (err) {
      console.log(err);
      alert('Error loading admin data');
    }
  };

  // Toggle form visibility
  const toggleForm = () => setShowForm(!showForm);

  // Handle project upload
  const handleAddProject = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    if (image) data.append('image', image);
    if (file) data.append('file', file);
    if (report) data.append('report', report);

    try {
      await API.post('/admin/project', data);
      alert('Project added successfully!');
      fetchAll();
      setForm({ name: '', description: '', price: '' });
      setImage(null);
      setFile(null);
      setReport(null);
      setShowForm(false);
    } catch (err) {
      console.log(err);
      alert('Upload failed');
    }
  };

  // DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/user/${id}`);
      fetchAll();
    } catch {
      alert('Failed to delete user');
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await API.delete(`/admin/project/${id}`);
      fetchAll();
    } catch {
      alert('Failed to delete project');
    }
  };

  // UPDATE ORDER
  const updateOrder = async (id, status) => {
    try {
      await API.put(`/admin/order/${id}`, { status });
      fetchAll();
    } catch {
      alert('Failed to update order');
    }
  };

  return (
    <>
      <Header />

      <div className="p-6 bg-gray-100 min-h-screen">

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

        {/* 👤 USERS TABLE */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-3">Users</h2>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t text-center">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => deleteUser(u._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📦 PROJECTS TABLE */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Projects</h2>
            <button
              onClick={toggleForm}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Add Project'}
            </button>
          </div>

          {/* Add Project Form */}
          {showForm && (
            <div className="bg-white p-6 rounded shadow mb-6">
              <form onSubmit={handleAddProject} className="grid gap-4 md:grid-cols-2">

                <input
                  type="text"
                  placeholder="Project Title"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border p-2 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border p-2 rounded"
                  required
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="border p-2 rounded md:col-span-2"
                  required
                />

                <div>
                  <label className="text-sm">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm">ZIP File</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm">Report (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setReport(e.target.files[0])}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700 md:col-span-2"
                >
                  Upload Project
                </button>

              </form>
            </div>
          )}

          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-t text-center">
                  <td>
                    <img
                      src={
                        p.image_url
                          ? `${BASE_URL}${p.image_url.startsWith('/') ? '' : '/'}${p.image_url}`
                          : 'https://via.placeholder.com/300'
                      }
                      className="h-12 mx-auto"
                      alt=""
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <button onClick={() => deleteProject(p._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🧾 ORDERS TABLE */}
        <div>
          <h2 className="text-xl font-bold mb-3">Orders</h2>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th>User</th>
                <th>Project</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t text-center">
                  <td>{o.user_name}</td>
                  <td>{o.project_name}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrder(o._id, e.target.value)}
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
    </>
  );
}