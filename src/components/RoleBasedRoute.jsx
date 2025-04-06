import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  if (!allowedRoles.includes(user?.role)) {
    // Redirect to default route based on role
    const defaultRoute = user?.role === 'client' ? '/client' : '/counselor';
    return <Navigate to={defaultRoute || '/login'} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;