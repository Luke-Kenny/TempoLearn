import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f2027",
        }}
      >
        <CircularProgress sx={{ color: "#2ecc71" }} />
      </Box>
    );
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
