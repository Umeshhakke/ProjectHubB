import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

// ✅ Get full decoded user
export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token); // contains id + role
  } catch {
    return null;
  }
};

// ✅ Get user ID
export const getUserId = () => {
  const user = getUser();
  return user?.id || null;
};

// ✅ Get role (IMPORTANT for admin)
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

// ✅ Check login
export const isLoggedIn = () => !!getToken();

// ✅ Check admin
export const isAdmin = () => getUserRole() === 'admin';

// ✅ Logout
export const logout = () => {
  localStorage.clear(); 
};