import React from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!requiredRole.includes(user.role)) {
    // Redirect to the correct dashboard instead of a missing /unauthorized page
    if (user.role === 'employee') {
      return <Navigate to="/employee-dashboard" />;
    }
    return <Navigate to="/admin-dashboard" />;
  }

  return children;
};

export default RoleBaseRoutes;
