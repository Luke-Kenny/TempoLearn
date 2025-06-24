import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import { motion } from "framer-motion"; //animation
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";

console.log("LandingPage.tsx is loading...");

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <ResponsiveAppBar />
      <div className="background content">
        <Container maxWidth="md">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography variant="h3" className="title">
              Welcome to <span className="highlight">TempoLearn</span>
            </Typography>
          </motion.div>

          {/* Animated Description (Slight Delay) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Typography variant="h6" className="description">
              Your study journey begins here.
            </Typography>
          </motion.div>

          {/* Animated Button (After Title & Description) */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: "#2ecc71" }}
              onClick={() => navigate("/signin")}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
