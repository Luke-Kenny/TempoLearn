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
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const hideAuthButtonsOnPaths = ["/", "/signin", "/signup"]; 
  const shouldShowAuthButton =
    !loading && !hideAuthButtonsOnPaths.includes(location.pathname); 

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#14181c",
        color: "#ffffff",
        borderBottom: "1px solid #2a2a2a",
        zIndex: 1300,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          px: { xs: 2, sm: 3 },
          minHeight: 64,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Logo */}
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
              letterSpacing: 0.4,
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Tempo
            <Box component="span" sx={{ color: "#2ecc71", ml: 0.5 }}>
              Learn
            </Box>
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {shouldShowAuthButton && (
          <Button
            onClick={user ? handleLogout : handleSignIn}
            variant="contained"
            sx={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              borderRadius: "999px",
              px: 2.5,
              py: 0.6,
              minHeight: "34px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
