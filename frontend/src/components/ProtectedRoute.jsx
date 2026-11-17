import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// renders the child routes only for logged-in users
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}