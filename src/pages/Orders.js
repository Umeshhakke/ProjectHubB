import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import Header from '../components/Header';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const userId = getUserId();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setOrders(res.data || []);
      } catch (err) {
        console.log("Order fetch error:", err);
      }
    };

    if (userId) {
      fetchOrders();
    }
    
  }, [userId]);

  if (!orders.length) {
    return (
      <>
        <Header />
        <p className="text-center mt-20 text-gray-500">
          No orders yet
        </p>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          My Orders
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <img
                src={`https://projecthub-397q.onrender.com${order.image_url}`}
                alt={order.name}
                className="w-full h-40 object-cover"
              />

              {/* CONTENT */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="font-bold text-lg mb-1">{order.name || 'Project Name'}</h2>

                  <p className="text-gray-500 text-sm mb-1">
                    Status: <span className="font-semibold">{order.status || 'Pending'}</span>
                  </p>

                  <p className="text-gray-500 text-sm mb-2">
                    Ordered on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </p>

                  <p className="font-semibold text-blue-600 mb-3">
                    ₹{order.price || 0}
                  </p>
                </div>

                {/* DOWNLOAD BUTTON */}
                {order.file_url ? (
                  <a
                    href={order.file_url.startsWith('http') ? order.file_url : `https://projecthub-397q.onrender.com${order.file_url}`}
                    download
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
                  >
                    Download
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed text-center"
                  >
                    File Not Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}