// src/pages/Home.tsx
import React from "react";
import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import WelcomeSection from "../components/WelcomeSection";
import CardCarousel from "../components/CardCarousel";
import BottomCta from "../components/BottomCta";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const CONTENT_RAIL = 920; // keep hero + carousel on the same visual center width

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `
          radial-gradient(900px 600px at 20% 0%, rgba(46,204,113,0.06) 0%, transparent 70%),
          radial-gradient(800px 500px at 80% 15%, rgba(45,156,219,0.05) 0%, transparent 65%),
          linear-gradient(to bottom right, #0f2027, #18232f)
        `,
        color: "#f8fafc",
      }}
    >
      <ResponsiveAppBar />

      {/* Welcome / Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeSection />
      </motion.div>

      {/* Card carousel on the SAME center rail as the hero */}
      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 4 }, mb: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: CONTENT_RAIL, mx: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <CardCarousel />
          </motion.div>
        </Box>
      </Container>

      <BottomCta />
      <Footer />
    </Box>
  );
};

export default Home;
