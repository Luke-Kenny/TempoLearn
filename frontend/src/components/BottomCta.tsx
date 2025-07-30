import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import illustrationTempo from "../assets/illustration-tempo.jpg";

const BottomCta: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: "#263544" }}>
      <Container>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={{ xs: 4, md: 6 }}
        >
          {/* Text Section */}
          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              sx={{ color: "#ffffff", fontSize: { xs: "1.4rem", md: "1.75rem" } }}
            >
              Every class, every test - one study tool.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#cbd5e1",
                fontSize: "1rem",
                lineHeight: 1.65,
                mb: 3,
              }}
            >
               Create flashcards, track progress, and access your study materials
              anytime, anywhere. Empower your learning with our adaptive
              platform.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/signin")}
              sx={{
                backgroundColor: "#2ecc71",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                px: 4,
                py: 1.3,
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
              alt="Student using TempoLearn"
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
