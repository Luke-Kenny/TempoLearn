// src/components/ResponsiveAppBar.tsx

import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

const ResponsiveAppBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const hideAuthButtonsOnPaths = ["/signin", "/signup"];
  const shouldShowAuthButton = !hideAuthButtonsOnPaths.includes(location.pathname);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#14181c", // darker to match hero/feature blend
        color: "#ffffff",
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          px: 3,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo and Brand Name */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <SchoolIcon sx={{ color: "#2ecc71", fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.3rem",
              fontFamily: "'Inter', sans-serif",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Tempo
            <Box component="span" sx={{ color: "#2ecc71" }}>
              Learn
            </Box>
          </Typography>
        </Box>

        {/* Push button to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Conditionally render Sign In or Logout */}
        {shouldShowAuthButton && (
          <Button
            onClick={user ? handleLogout : handleSignIn}
            variant="contained"
            sx={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "6px", // small, subtle rounding
              px: 2.2,
              py: 0.5,
              fontSize: "0.85rem",
              minHeight: "32px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#27ae60",
              },
            }}
          >
            {user ? "Logout" : "Sign In"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;
