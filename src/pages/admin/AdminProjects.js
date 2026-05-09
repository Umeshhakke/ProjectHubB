import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const BASE_URL = 'https://projecthub-397q.onrender.com';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    API.get('/admin/projects').then(res => setProjects(res.data)).catch(console.error);
  }, []);

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
      alert('Project added!');
      setProjects(prev => [...prev, { ...form, image_url: '', price: Number(form.price) }]); // optimistic; real fetch better
      setShowForm(false);
      setForm({ name: '', description: '', price: '' });
      setImage(null);
      setFile(null);
      setReport(null);
    } catch (err) {
      alert('Upload failed');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await API.delete(`/admin/project/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <form onSubmit={handleAddProject} className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Project Title" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" required />
            <input type="number" placeholder="Price" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" required />
            <textarea placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 rounded md:col-span-2" required />
            <div>
              <label className="text-sm">Image</label>
              <input type="file" onChange={e => setImage(e.target.files[0])} className="border p-2 rounded w-full" required />
            </div>
            <div>
              <label className="text-sm">ZIP File</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} className="border p-2 rounded w-full" required />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Report (Optional)</label>
              <input type="file" onChange={e => setReport(e.target.files[0])} className="border p-2 rounded w-full" />
            </div>
            <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 md:col-span-2">
              Upload Project
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  <img
                    src={p.image_url ? `${BASE_URL}${p.image_url.startsWith('/') ? '' : '/'}${p.image_url}` : 'https://via.placeholder.com/300'}
                    className="h-12 mx-auto"
                    alt=""
                  />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  <button onClick={() => deleteProject(p._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}