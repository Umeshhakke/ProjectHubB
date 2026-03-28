import React from 'react';

export default function ProjectModal({ project, onClose, onAddToCart }) {
  const BASE_URL = "https://projecthub-397q.onrender.com";

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto z-50 p-4">
      
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl z-10"
        >
          ✖
        </button>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto flex-1">

          {/* IMAGE */}
          {project.image_url && (
            <img
              src={`${BASE_URL}${project.image_url.startsWith('/') ? '' : '/'}${project.image_url}`}
              alt={project.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
          )}

          <div className="p-6">
            {/* DETAILS */}
            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>

            <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
              {project.description || 'No description available'}
            </p>

            <p className="text-lg font-semibold text-blue-600">
              ₹{project.price}
            </p>
          </div>
        </div>

        {/* FIXED BUTTON */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={() => onAddToCart(project)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}