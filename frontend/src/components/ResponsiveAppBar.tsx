import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/education.png";

const ResponsiveAppBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  // Optional: list of routes that shouldn't show the logout button
  const hideLogoutOnPaths = ["/", "/signin", "/signup"];
  const shouldShowLogout =
    user && !hideLogoutOnPaths.includes(location.pathname);

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(135deg, #1C1E22, #181A1F)",
        color: "white",
        padding: "8px 0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        {/* Logo & Brand Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="App Logo" style={{ height: "40px" }} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.4rem",
                color: "white",
                fontFamily: "Playfair Display, sans-serif",
                fontWeight: "bold",
              }}
            >
              TempoLearn
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: "#8FBC8F",
                fontWeight: "bold",
                mt: "-2px",
              }}
            >
              An Adaptive Study Management Tool
            </Typography>
          </Box>
        </Box>

        {/* Show logout button only when user is signed in and not on landing/signin/signup */}
        {shouldShowLogout && (
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              color: "#e74c3c",
              borderColor: "#e74c3c",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(231, 76, 60, 0.1)",
                borderColor: "#c0392b",
                color: "#c0392b",
              },
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;
