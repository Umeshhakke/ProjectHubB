import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './utils/auth';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminRequests from './pages/admin/AdminRequests';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Login → if already logged in, go to projects */}
        <Route 
          path="/login" 
          element={isLoggedIn() ? <Navigate to="/projects" /> : <Login />} 
        />

        {/* Signup */}
        <Route 
          path="/signup" 
          element={isLoggedIn() ? <Navigate to="/projects" /> : <Signup />} 
        />

        {/* Protected Routes */}
        <Route path="/projects" element={
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
        } />

        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;