// src/components/BottomCta.tsx

import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import illustrationTempo from "../assets/illustration-tempo.jpg";

const BottomCta: React.FC = () => {
  const navigate = useNavigate();

  const handleTryItOut = () => {
    navigate("/signin");
  };

  return (
    <Box sx={{ py: 10, backgroundColor: "#263544" }}>
      <Container>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={{ xs: 4, md: 6 }}
          alignItems="center"
        >
          {/* Text Section */}
          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#ffffff" }}
            >
              Every class, every test — one study tool.
            </Typography>
            <Typography variant="body1" color="#bbb" gutterBottom>
              Create flashcards, track progress, and access your study materials
              anytime, anywhere. Empower your learning with our adaptive
              platform.
            </Typography>
            <Button
              variant="contained"
              onClick={handleTryItOut}
              sx={{
                mt: 2,
                backgroundColor: "#2ecc71",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "999px",
                "&:hover": { backgroundColor: "#27ae60" },
              }}
            >
              Try it out
            </Button>
          </Box>

          {/* Illustration */}
          <Box
            flex={1}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={illustrationTempo}
              alt="Study Illustration"
              sx={{
                width: "100%",
                maxWidth: "100%",
                height: 180,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BottomCta;
