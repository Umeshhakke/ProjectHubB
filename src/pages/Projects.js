import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { getUserId } from '../utils/auth';
import ProjectHeader from '../components/ProjectHeader';
import { useCart } from '../context/CartContext';
import ProjectModal from '../components/ProjectModal';

export default function Projects() {
  const [allProjects, setAllProjects] = useState([]);
  const [error, setError] = useState('');
  const { fetchCart } = useCart();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const [priceFilter, setPriceFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState([]);
  const [techFilter, setTechFilter] = useState([]);

  // Request form fields – now includes deadline
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    techStack: '',
    budget: '',
    level: 'Beginner',
    deadline: '',          // <-- new field
    additionalNotes: ''
  });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setAllProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  // ---------- HELPERS ----------
  const getLevel = (price) => {
    if (price < 100) return 'Beginner';
    if (price >= 100 && price <= 300) return 'Moderate';
    return 'Advanced';
  };

  const detectTech = (desc = '') => {
    const d = desc.toLowerCase();
    const techs = [];
    if (d.includes('react')) techs.push('React');
    if (d.includes('node')) techs.push('Node');
    if (d.includes('ai')) techs.push('AI');
    if (d.includes('ml')) techs.push('ML');
    return techs;
  };

  const addToCart = async (project) => {
    const userId = getUserId();
    try {
      await API.post('/cart', { userId, projectId: project._id });
      alert(`${project.name} added to cart!`);
      fetchCart();
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  // ---------- FILTER LOGIC ----------
  const filteredProjects = allProjects
    .filter((p) => {
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const matchesSearch = name.includes(search.toLowerCase());

      let matchesPrice = true;
      if (priceFilter === 'low') matchesPrice = p.price < 500;
      if (priceFilter === 'high') matchesPrice = p.price >= 500;

      const level = getLevel(p.price);
      const matchesLevel = levelFilter.length > 0 ? levelFilter.includes(level) : true;

      const techs = detectTech(desc);
      const matchesTech = techFilter.length > 0 ? techFilter.some(t => techs.includes(t)) : true;

      return matchesSearch && matchesPrice && matchesLevel && matchesTech;
    })
    .sort((a, b) => {
      if (sortOrder === 'low-high') return a.price - b.price;
      if (sortOrder === 'high-low') return b.price - a.price;
      return 0;
    });

  // ---------- FILTER HANDLERS ----------
  const handleLevel = (level, checked) => {
    setLevelFilter(prev => checked ? [...prev, level] : prev.filter(l => l !== level));
  };

  const handleTech = (tech, checked) => {
    setTechFilter(prev => checked ? [...prev, tech] : prev.filter(t => t !== tech));
  };

  const resetAllFilters = () => {
    setPriceFilter('');
    setLevelFilter([]);
    setTechFilter([]);
  };

  // ---------- REQUEST FORM HANDLERS ----------
  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const submitProjectRequest = async (e) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestError('');

    if (!requestForm.title.trim() || !requestForm.description.trim()) {
      setRequestError('Title and description are required.');
      setRequestSubmitting(false);
      return;
    }

    try {
      // TODO: Replace with your actual API endpoint
      await API.post('/project-requests', {
        title: requestForm.title.trim(),
        description: requestForm.description.trim(),
        techStack: requestForm.techStack.trim(),
        budget: requestForm.budget.trim() || 'Not specified',
        level: requestForm.level,
        deadline: requestForm.deadline.trim() || 'Not specified',   // <-- send deadline
        additionalNotes: requestForm.additionalNotes.trim()
      });

      alert('Project request submitted successfully! We will get back to you soon.');
      setShowRequestModal(false);
      setRequestForm({
        title: '',
        description: '',
        techStack: '',
        budget: '',
        level: 'Beginner',
        deadline: '',
        additionalNotes: ''
      });
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setRequestSubmitting(false);
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
      <ProjectHeader
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className="min-h-screen bg-gray-100 p-4 flex gap-6">
        {/* SIDEBAR */}
        <div className="w-72 bg-white rounded-2xl shadow-lg p-5 hidden md:block h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Filters</h2>

          {/* Price */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Price</p>
            <label><input type="radio" name="price" onChange={() => setPriceFilter('low')} /> Under ₹500</label><br />
            <label><input type="radio" name="price" onChange={() => setPriceFilter('high')} /> Above ₹500</label><br />
            <label><input type="radio" name="price" onChange={() => setPriceFilter('')} /> All</label>
          </div>

          {/* Level */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Level</p>
            {['Beginner', 'Moderate', 'Advanced'].map(level => (
              <label key={level}>
                <input type="checkbox" onChange={(e) => handleLevel(level, e.target.checked)} /> {level}
              </label>
            ))}
          </div>

          {/* Tech */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Tech</p>
            {['React', 'Node', 'AI', 'ML', 'Python', 'C', 'C++', 'Java', 'Arduino'].map(tech => (
              <label key={tech}>
                <input type="checkbox" onChange={(e) => handleTech(tech, e.target.checked)} /> {tech}
              </label>
            ))}
          </div>

          <button onClick={resetAllFilters} className="w-full py-2 bg-red-500 text-white rounded-lg">
            Clear Filters
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">
            Projects ({filteredProjects.length})
          </h1>

          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-gray-600 mb-4 text-lg">
                No projects found. Try adjusting your filters or request a new project.
              </p>
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Request a Project
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 transition duration-300"
                >
                  <img
                    src={project.image_url ? `${BASE_URL}${project.image_url}` : 'https://via.placeholder.com/300'}
                    alt={project.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{project.name}</h2>
                    <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{getLevel(project.price)}</p>
                    <p className="font-bold text-blue-600 mt-2">₹{project.price}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => addToCart(project)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">Add</button>
                      <button onClick={() => setSelectedProject(project)} className="flex-1 py-2 bg-gray-200 rounded-lg">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PROJECT DETAIL MODAL */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAddToCart={addToCart}
      />

      {/* REQUEST PROJECT MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Request a New Project</h2>
            <p className="text-gray-600 mb-4">Tell us what you need and when you need it by.</p>

            <form onSubmit={submitProjectRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={requestForm.title}
                  onChange={handleRequestInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Smart Home Automation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description *</label>
                <textarea
                  name="description"
                  value={requestForm.description}
                  onChange={handleRequestInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your project, key features, and purpose..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  name="techStack"
                  value={requestForm.techStack}
                  onChange={handleRequestInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node, Python"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Budget (₹)</label>
                  <input
                    type="text"
                    name="budget"
                    value={requestForm.budget}
                    onChange={handleRequestInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Difficulty Level</label>
                  <select
                    name="level"
                    value={requestForm.level}
                    onChange={handleRequestInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Beginner</option>
                    <option>Moderate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              {/* NEW: Project Deadline */}
              <div>
                <label className="block text-sm font-semibold mb-1">Project Deadline (optional)</label>
                <input
                  type="date"
                  name="deadline"
                  value={requestForm.deadline}
                  onChange={handleRequestInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={requestForm.additionalNotes}
                  onChange={handleRequestInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any other requirements..."
                ></textarea>
              </div>

              {requestError && <p className="text-red-500 text-sm">{requestError}</p>}

              <button
                type="submit"
                disabled={requestSubmitting}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  requestSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {requestSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}