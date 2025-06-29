import React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import WelcomeSection from "../components/WelcomeSection";
import CardCarousel from "../components/CardCarousel";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <ResponsiveAppBar />
      <WelcomeSection />
      <CardCarousel />
      <Footer />
    </Box>
  );
};

export default Home;
