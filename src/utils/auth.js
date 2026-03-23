import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const getUserId = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token).id;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!getUserId();

export const logout = () => {
  localStorage.removeItem('token');
};