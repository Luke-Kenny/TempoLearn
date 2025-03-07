import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin"); 
  };

  return (
    <Container>
      <Typography variant="h4">Welcome, {user?.email}</Typography>
      <Button variant="contained" onClick={handleLogout} sx={{ mt: 3 }}>Logout</Button>
    </Container>
  );
};

export default Home;
