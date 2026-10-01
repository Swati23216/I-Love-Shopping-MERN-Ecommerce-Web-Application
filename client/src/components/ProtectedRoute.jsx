import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function ProtectedRoute({children, admin = false}) {
  const {user, loading} = useAuth();
  const location = useLocation();

  if (loading) return <div className="center">Loading...</div>;
  if (!user) {
    const destination = location.pathname === '/' ? '/register' : '/login';
    return <Navigate to={destination} state={{from: location}} replace />;
  }
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children || <Outlet />;
}