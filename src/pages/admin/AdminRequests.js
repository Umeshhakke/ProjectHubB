import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [negotiateId, setNegotiateId] = useState(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/project-requests/admin');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestAction = async (id, status, price = null, notes = '') => {
    try {
      const res = await API.put(`/project-requests/admin/${id}`, {
        status,
        adminPrice: price,
        adminNotes: notes,
      });
      setRequests(prev => prev.map(r => r._id === id ? res.data : r));
      setNegotiateId(null);
      if (selectedRequest?._id === id) setSelectedRequest(res.data);
    } catch {
      alert('Action failed');
    }
  };

  const openDetailModal = (req) => setSelectedRequest(req);
  const closeDetailModal = () => setSelectedRequest(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Project Requests</h1>
      <div className="overflow-x-auto bg-white rounded shadow mb-6">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Title</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id} className="border-t">
                <td className="p-3">{req.userId?.name || 'N/A'}</td>
                <td className="p-3 font-medium">{req.title}</td>
                <td className="p-3">₹{req.budget || '-'}</td>
                <td className="p-3">{req.deadline || '-'}</td>
                <td className={`p-3 capitalize font-semibold ${
                  req.status === 'accepted' ? 'text-green-600' :
                  req.status === 'rejected' ? 'text-red-600' :
                  req.status === 'negotiation' ? 'text-yellow-600' : ''
                }`}>{req.status}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => openDetailModal(req)} className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">
                      View
                    </button>
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => handleRequestAction(req._id, 'accepted')} className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">Accept</button>
                        <button onClick={() => handleRequestAction(req._id, 'rejected')} className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">Reject</button>
                        <button onClick={() => { setNegotiateId(req._id); setCounterPrice(req.budget || ''); setAdminNotes(''); }} className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs">Negotiate</button>
                      </>
                    )}
                    {req.status === 'negotiation' && (
                      <>
                        <span className="text-xs text-gray-600 mr-1">Proposed: ₹{req.adminPrice}</span>
                        <button onClick={() => handleRequestAction(req._id, 'accepted')} className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">Accept</button>
                        <button onClick={() => handleRequestAction(req._id, 'rejected')} className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedRequest.title}</h2>
              <button onClick={closeDetailModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>User:</strong> {selectedRequest.userId?.name || 'N/A'} ({selectedRequest.userId?.email || ''})</p>
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <p><strong>Tech Stack:</strong> {selectedRequest.techStack || 'N/A'}</p>
              <p><strong>Budget:</strong> ₹{selectedRequest.budget || 'N/A'}</p>
              <p><strong>Level:</strong> {selectedRequest.level}</p>
              <p><strong>Deadline:</strong> {selectedRequest.deadline || 'N/A'}</p>
              <p><strong>Additional Notes:</strong> {selectedRequest.additionalNotes || 'N/A'}</p>
              <p><strong>Status:</strong> <span className="capitalize">{selectedRequest.status}</span></p>
              {selectedRequest.status === 'negotiation' && (
                <>
                  <p><strong>Admin Proposed Price:</strong> ₹{selectedRequest.adminPrice}</p>
                  <p><strong>Admin Note:</strong> {selectedRequest.adminNotes || 'N/A'}</p>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={closeDetailModal} className="bg-gray-300 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Negotiation Modal */}
      {negotiateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold text-lg mb-3">Negotiate Price</h3>
            <label className="block mb-1 text-sm">Counter Price (₹)</label>
            <input type="number" className="w-full border p-2 rounded mb-3" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} />
            <label className="block mb-1 text-sm">Note to User</label>
            <textarea className="w-full border p-2 rounded mb-4" rows="2" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setNegotiateId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={() => handleRequestAction(negotiateId, 'negotiation', counterPrice, adminNotes)} className="px-4 py-2 bg-blue-600 text-white rounded">Submit Negotiation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}