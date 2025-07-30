import React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import WelcomeSection from "../components/WelcomeSection";
import CardCarousel from "../components/CardCarousel";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #0f2027, #18232f)",
        minHeight: "100vh",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveAppBar />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <CardCarousel />
      </motion.div>

      <Footer />
    </Box>
  );
};

export default Home;
