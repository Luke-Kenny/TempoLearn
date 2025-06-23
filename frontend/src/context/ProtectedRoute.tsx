import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Redirects users to /signin if not logged in.
 * Uses <Outlet /> to wrap any protected pages inside this route.
 */

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
