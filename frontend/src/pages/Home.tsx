import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <div className="page-container">
      {/* ✅ Ensure AppBar is included at the top */}
      <ResponsiveAppBar />

      <Box 
        className="background" 
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, #1A2C2F, #165A4A, #218C74)", 
          color: "white",
          paddingTop: "64px", 
        }}
      >
        <Typography variant="h4">
          Welcome, <span style={{ color: "#2ecc71", fontWeight: "bold" }}>{user?.email}</span>!
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleLogout} 
          sx={{ mt: 3, backgroundColor: "#ff4d4d", "&:hover": { backgroundColor: "#cc0000" } }}
        >
          Logout
        </Button>
      </Box>
    </div>
  );
};

export default Home;
