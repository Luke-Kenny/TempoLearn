import React from "react";
import { Container, Typography } from "@mui/material";
import "../styles/App.css";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";

console.log("✅ LandingPage.tsx is loading...");

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <ResponsiveAppBar />
      <div className="background content">
        <Container maxWidth="md">
          <Typography variant="h3" className="title">
            Welcome to TempoLearn
          </Typography>
          <Typography variant="h6" className="description">
            You logged in finally BOZO
          </Typography>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
