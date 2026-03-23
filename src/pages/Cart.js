import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { fetchCart } = useCart();
  const userId = getUserId();

  // ✅ Fetch cart
  useEffect(() => {
  const loadCart = async () => {
    if (!userId) return;

    try {
      const res = await API.get(`/cart/${userId}`);
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setCart([]);
    }
  };

  loadCart();
}, [userId]);

  // ✅ Remove item
  const removeFromCart = async (cartId) => {
    try {
      await API.delete(`/cart/${cartId}`);

      setCart(cart.filter((item) => item.cart_id !== cartId));

      fetchCart(); // update header
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  // ✅ CHECKOUT (RAZORPAY)
const checkout = async () => {
  if (!cart.length) return alert('Cart is empty!');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  if (total <= 0) return alert("Invalid amount");

  try {
    const { data } = await API.post('/orders/create-order', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    console.log("ORDER DATA:", data);

    if (!data.order_id) {
      alert("Order creation failed");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "ProjectHub",
      description: "Purchase Projects",
      order_id: data.order_id,

      handler: async function (response) {
        try {
          await API.post('/orders/verify-payment', response, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          alert("Payment Successful!");
          setCart([]);
          fetchCart();
          window.location.href = "/orders";

        } catch (err) {
          console.log(err);
          alert("Verification failed");
        }
      },

      theme: { color: "#3399cc" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log("FULL ERROR:", err);
    alert(err?.response?.data?.message || "Payment failed");
  }
};
  // ✅ Empty cart UI
  if (!cart.length) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Your cart is empty.
      </p>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Cart
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">

        {cart.map((c) => (
          <div
            key={c.cart_id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
          >
            <div>
              <h2 className="font-bold text-lg">{c.name}</h2>
              <p className="text-gray-600">₹{c.price}</p>
            </div>

            <button
              onClick={() => removeFromCart(c.cart_id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}

        {/* 🔥 Checkout Button */}
        <button
          onClick={checkout}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
          Checkout
        </button>

      </div>
    </div>
  );
}
