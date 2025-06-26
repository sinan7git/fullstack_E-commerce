import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

const PrivateRoute = () => {
  const { userData } = useContext(UserContext);
  const location = useLocation();

  // If user is authenticated, allow access
  if (userData && userData.access) {
    return <Outlet />;
  }

  // Redirect to login and preserve the current path
  return <Navigate to="/login/" state={{ from: location }} replace />;
};

export default PrivateRoute;
