import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";
import BottomCta from "../components/BottomCta";

import SchoolIcon from "@mui/icons-material/School";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const features = [
  {
    title: "AI Quiz Generation",
    description:
      "Upload your own notes and generate personalized quizzes tailored to your individual preferences.",
    icon: <TimelineIcon sx={{ fontSize: 40, color: "#2ecc71" }} />,
  },
  {
    title: "Smart Note Summarization",
    description:
      "Receive custom-generated summaries, key concepts, visuals suggestions, and insights from your uploaded material — all powered by AI.",
    icon: <SchoolIcon sx={{ fontSize: 40, color: "#2ecc71" }} />,
  },
  {
    title: "Progress & Emotion Tracking",
    description:
      "Monitor quiz history, performance trends, and log your mood to build awareness and motivation around learning progress.",
    icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#2ecc71" }} />,
  },
];


const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f2027",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ResponsiveAppBar />

      {/* Hero */}
      <Box
        sx={{
          flex: 1,
          py: { xs: 10, md: 14 },
          px: 3,
          textAlign: "center",
          background: "linear-gradient(to bottom right, #18232f, #1f2d3a)",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.5rem", sm: "3.6rem" },
                color: "#f8fafc",
                mb: 2,
              }}
            >
              Welcome to{" "}
              <Box component="span" sx={{ color: "#2ecc71" }}>
                TempoLearn
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#cbd5e1",
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Your intelligent study assistant. Learn faster, stay focused, and
              reach your academic milestones with ease and structure.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/signin")}
              sx={{
                backgroundColor: "#2ecc71",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "999px",
                px: 4,
                py: 1.3,
                fontSize: "1rem",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                "&:hover": {
                  backgroundColor: "#27ae60",
                },
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Box sx={{ backgroundColor: "#18232f", py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: "#f8fafc",
              fontWeight: 600,
              mb: 6,
              letterSpacing: 0.3,
            }}
          >
            Why Choose TempoLearn?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <Card
                    elevation={4}
                    sx={{
                      backgroundColor: "#24303f",
                      borderRadius: 3,
                      textAlign: "center",
                      py: 4,
                      px: 3,
                      minHeight: 240,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#f8fafc",
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#cbd5e1",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action + Footer */}
      <BottomCta />
      <Footer />
    </Box>
  );
};

export default LandingPage;
