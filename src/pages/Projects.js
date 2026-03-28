import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import ProjectHeader from '../components/ProjectHeader';
import { useCart } from '../context/CartContext';
import ProjectModal from '../components/ProjectModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [error, setError] = useState('');
  const { fetchCart } = useCart();
  const [selectedProject, setSelectedProject] = useState(null);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const [priceFilter, setPriceFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState([]);
  const [techFilter, setTechFilter] = useState([]);

  const BASE_URL = "https://projecthub-397q.onrender.com";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
        setAllProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  // ✅ ADD TO CART (UNCHANGED)
  const addToCart = async (project) => {
    const userId = getUserId();

    try {
      await API.post('/cart', {
        userId: userId,
        projectId: project._id
      });

      alert(`${project.name} added to cart!`);
      fetchCart();
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  // ✅ LEVEL FROM PRICE
  const getLevel = (price) => {
    if (price < 100) return 'Beginner';
    if (price >= 100 && price <= 300) return 'Moderate';
    return 'Advanced';
  };

  // ✅ TECH DETECTION FROM DESCRIPTION
  const detectTech = (desc = '') => {
    const d = desc.toLowerCase();

    const techs = [];
    if (d.includes('react')) techs.push('React');
    if (d.includes('node')) techs.push('Node');
    if (d.includes('ai')) techs.push('AI');
    if (d.includes('ml')) techs.push('ML');

    return techs;
  };

  // ✅ FINAL FILTER LOGIC
  const filteredProjects = allProjects
    .filter((p) => {
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();

      // 🔍 SEARCH
      const matchesSearch = name.includes(search.toLowerCase());

      // 💰 PRICE
      let matchesPrice = true;
      if (priceFilter === 'low') matchesPrice = p.price < 500;
      if (priceFilter === 'high') matchesPrice = p.price >= 500;

      // 🎯 LEVEL
      let matchesLevel = true;
      const level = getLevel(p.price);
      if (levelFilter.length > 0) {
        matchesLevel = levelFilter.includes(level);
      }

      // 🧠 TECH
      let matchesTech = true;
      const techs = detectTech(desc);
      if (techFilter.length > 0) {
        matchesTech = techFilter.some(t => techs.includes(t));
      }

      return matchesSearch && matchesPrice && matchesLevel && matchesTech;
    })
    .sort((a, b) => {
      if (sortOrder === 'low-high') return a.price - b.price;
      if (sortOrder === 'high-low') return b.price - a.price;
      return 0;
    });

  // ✅ HANDLERS
  const handleLevel = (level, checked) => {
    if (checked) setLevelFilter([...levelFilter, level]);
    else setLevelFilter(levelFilter.filter(l => l !== level));
  };

  const handleTech = (tech, checked) => {
    if (checked) setTechFilter([...techFilter, tech]);
    else setTechFilter(techFilter.filter(t => t !== tech));
  };

  const resetAllFilters = () => {
    setPriceFilter('');
    setLevelFilter([]);
    setTechFilter([]);
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
      {/* 🔥 HEADER */}
      <ProjectHeader
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="min-h-screen bg-gray-100 p-4 flex gap-6">

        {/* 🔥 SIDEBAR */}
        <div className="w-72 bg-white rounded-2xl shadow-lg p-5 hidden md:block h-fit sticky top-20">

          <h2 className="text-xl font-bold mb-4 border-b pb-2">Filters</h2>

          {/* PRICE */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Price</p>
            <label><input type="radio" name="price" onChange={() => setPriceFilter('low')} /> Under ₹500</label><br />
            <label><input type="radio" name="price" onChange={() => setPriceFilter('high')} /> Above ₹500</label><br />
            <label><input type="radio" name="price" onChange={() => setPriceFilter('')} /> All</label>
          </div>

          {/* LEVEL */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Level</p>
            <label><input type="checkbox" onChange={(e) => handleLevel('Beginner', e.target.checked)} /> Beginner</label><br />
            <label><input type="checkbox" onChange={(e) => handleLevel('Moderate', e.target.checked)} /> Moderate</label><br />
            <label><input type="checkbox" onChange={(e) => handleLevel('Advanced', e.target.checked)} /> Advanced</label>
          </div>

          {/* TECH */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Tech</p>
            <label><input type="checkbox" onChange={(e) => handleTech('React', e.target.checked)} /> React</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('Node', e.target.checked)} /> Node</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('AI', e.target.checked)} /> AI</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('ML', e.target.checked)} /> ML</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('Python', e.target.checked)} /> Python</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('C', e.target.checked)} /> C</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('C++', e.target.checked)} /> C++</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('Java', e.target.checked)} /> Java</label><br />
            <label><input type="checkbox" onChange={(e) => handleTech('Arduino', e.target.checked)} /> Arduino</label><br />
          </div>

          <button
            onClick={resetAllFilters}
            className="w-full py-2 bg-red-500 text-white rounded-lg"
          >
            Clear Filters
          </button>
        </div>

        {/* 🔥 PRODUCTS */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">
            Projects ({filteredProjects.length})
          </h1>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={
                    project.image_url
                      ? `${BASE_URL}${project.image_url}`
                      : 'https://via.placeholder.com/300'
                  }
                  alt={project.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h2 className="font-semibold text-lg">{project.name}</h2>

                  <p className="text-gray-500 text-sm line-clamp-2">
                    {project.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {getLevel(project.price)}
                  </p>

                  <p className="font-bold text-blue-600 mt-2">
                    ₹{project.price}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addToCart(project)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Add
                    </button>

                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 py-2 bg-gray-200 rounded-lg"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* MODAL */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAddToCart={addToCart}
      />
    </>
  );
}