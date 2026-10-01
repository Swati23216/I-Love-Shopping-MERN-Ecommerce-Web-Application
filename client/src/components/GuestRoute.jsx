import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function GuestRoute() {
  const {user, loading} = useAuth();

  if (loading) return <div className="center">Loading...</div>;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
