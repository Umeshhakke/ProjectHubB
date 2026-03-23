import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import Header from '../components/Header';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  // const userId = getUserId();

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/${userId}`, {
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

    if (userId) fetchOrders();
  }, [userId]);

  if (!orders.length) {
    return (
      <>
        <Header />
        <p className="text-center mt-20">No orders yet</p>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          My Orders
        </h1>

        <div className="max-w-3xl mx-auto space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
            >
              <div>
                <h2 className="font-bold">{order.name}</h2>
                <p>₹{order.price}</p>
              </div>

              <a
                href={`https://projectsuploads.onrender.com/${order.file_url}`}
                download
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
