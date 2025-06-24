import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTempoStudyClick = () => {
    navigate("/tempostudy"); // placeholder route for the future page
  };

  return (
    <Container maxWidth="md" sx={{ pt: 12, pb: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem" } }}
        >
          Welcome to{" "}
          <Box component="span" sx={{ color: "#2ecc71" }}>
            TempoLearn
          </Box>
          {user?.email ? `, ${user.email}!` : "!"}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          sx={{ color: "#ccc", maxWidth: 700, mx: "auto", mb: 4 }}
        >
          Your personalized study assistant—designed to help you plan, track,
          and master your academic goals with ease. Select a section below to
          begin your learning journey.
        </Typography>
      </motion.div>

      {/* Centered TempoStudy Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleTempoStudyClick}
          sx={{
            backgroundColor: "#2d9cdb",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "30px",
            px: 4,
            py: 1.2,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#238ac9",
            },
          }}
        >
          TempoStudy
        </Button>
      </Box>
    </Container>
  );
};

export default WelcomeSection;
