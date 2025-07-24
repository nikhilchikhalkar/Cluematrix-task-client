import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const PrivateRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user.token || (roles && !roles.includes(user.role))) return <Navigate to="/" replace />;
  return children;
};
