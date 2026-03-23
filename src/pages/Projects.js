import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import ProjectModal from '../components/ProjectModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const { fetchCart } = useCart();
  const [selectedProject, setSelectedProject] = useState(null);
  const BASE_URL = "https://projectsuploads.onrender.com";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  const addToCart = async (project) => {
    const userId = getUserId();

    try {
      await API.post('/cart', {
        user_id: userId,
        project_id: project.id,
      });

      alert(`${project.name} added to cart!`);
      fetchCart(); // update cart count
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Available Projects
        </h1>

        {/* 🔥 PREMIUM GRID */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
            >
              {/* IMAGE */}
              <img
                src={
                  project.image_url
                    ? `${BASE_URL}${project.image_url.startsWith('/') ? '' : '/'}${project.image_url}`
                    : 'https://via.placeholder.com/300'
                }
                alt={project.name}
                className="w-full h-40 object-cover"
              />

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="font-bold text-lg mb-1">
                  {project.name}
                </h2>

                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {project.description}
                </p>

                <p className="font-semibold mb-3 text-blue-600">
                  ₹{project.price}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(project)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* 🔥 MODAL */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAddToCart={addToCart}
      />
    </>
  );
}