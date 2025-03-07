import React from "react";
import { Container, Typography } from "@mui/material";
import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Footer from "./components/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="page-container"> 
      <ResponsiveAppBar />
      <div className="background content">
        <Container maxWidth="md">
          <Typography variant="h3" className="title">
            Welcome to TempoLearn
          </Typography>
          <Typography variant="h6" className="description">
            Unfortunately we are still currently under development
          </Typography>
          <Typography variant="body1" className="subtext">
            Stay tuned for updates!
          </Typography>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
