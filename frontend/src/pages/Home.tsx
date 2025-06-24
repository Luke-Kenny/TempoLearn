import React from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import WelcomeSection from "../components/WelcomeSection";
import CardCarousel from "../components/CardCarousel";
import BottomCta from "../components/BottomCta";

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
      <BottomCta />
    </Box>
  );
};

export default Home;
