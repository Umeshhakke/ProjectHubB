import React from 'react';

export default function ProjectModal({ project, onClose, onAddToCart }) {
  const BASE_URL = "http://localhost:5000";

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>

        {/* IMAGE */}
        {project.image_url && (
          <img
            src={
              project.image_url
                ? `${BASE_URL}${project.image_url.startsWith('/') ? '' : '/'}${project.image_url}`
                : 'https://via.placeholder.com/300'
            }
            alt={project.name}
            className="w-full h-40 object-cover"
          />
        )}

        {/* DETAILS */}
        <h2 className="text-2xl font-bold mb-2">{project.name}</h2>

        <p className="text-gray-600 mb-4">
          {project.description || 'No description available'}
        </p>

        <p className="text-lg font-semibold mb-4">
          Price: ₹{project.price}
        </p>

        {/* ACTION */}
        <button
          onClick={() => onAddToCart(project)}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}