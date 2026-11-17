import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// login and signup are not needed when already logged in
export default function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/employees" replace /> : <Outlet />;
}