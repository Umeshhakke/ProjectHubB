import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchCart } = useCart();
  const userId = getUserId();

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) return;

      try {
        const res = await API.get(`/cart/${userId}`);
        const items = Array.isArray(res.data)
          ? res.data.map(item => ({
              cart_id: item.cart_id,
              name: item.name,
              price: item.price,
              image_url: item.image_url,
              description: item.description || '',
            }))
          : [];
        setCart(items);
      } catch (err) {
        console.error(err);
        setCart([]);
      }
    };

    loadCart();
  }, [userId]);

  const removeFromCart = async (cartId) => {
    try {
      await API.delete(`/cart/${cartId}`);
      setCart(cart.filter(item => item.cart_id !== cartId));
      fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  // -----------------------
  // RAZORPAY CHECKOUT
  // -----------------------
  const checkout = async () => {
    if (!cart.length) return alert('Your cart is empty!');

    try {
      setLoading(true);

      // 1️⃣ Create order on backend
      const { data: order } = await API.post(
        '/orders/create-order',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // 2️⃣ Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Store Name',
        description: 'Project Purchase',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // 3️⃣ Verify payment on backend
            await API.post(
              '/orders/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            alert('Payment successful!');
            setCart([]);       // clear frontend cart
            fetchCart();       // refresh cart context
          } catch (err) {
            console.error(err);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Payment failed. Try again!');
      setLoading(false);
    }
  };

  if (!cart.length) {
  return (
    <>
      <Header />
      <p className="text-center mt-20 text-gray-500">
        Your cart is empty.
      </p>
    </>
  );
}

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        <div className="max-w-5xl mx-auto space-y-4">
          {cart.map(item => (
            <div
              key={item.cart_id}
              className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:5000${item.image_url}` || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg" />

              <div className="flex-1 ml-0 sm:ml-4 mt-3 sm:mt-0">
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>
                <p className="font-semibold text-blue-600 mt-1">₹{item.price}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.cart_id)}
                className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mr-4">Total: ₹{totalAmount}</h2>
            <button
              onClick={checkout}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}