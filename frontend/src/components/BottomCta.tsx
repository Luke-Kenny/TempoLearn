// src/components/BottomCta.tsx

import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";

const BottomCta: React.FC = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#1a252f" }}>
      <Container>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={6}
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
              sx={{
                mt: 2,
                backgroundColor: "#2ecc71",
                color: "white",
                "&:hover": { backgroundColor: "#27ae60" },
              }}
            >
              Learn More
            </Button>
          </Box>

          {/* Illustration Placeholder */}
          <Box
            flex={1}
            sx={{
              width: "100%",
              height: 250,
              backgroundColor: "#0f2d3d",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2ecc71",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            [Illustration / Image Placeholder]
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BottomCta;
