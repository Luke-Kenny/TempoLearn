import React from "react";
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";
import SchoolIcon from "@mui/icons-material/School";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BottomCta from "../components/BottomCta";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Planning",
      description: "Effortlessly schedule and track study sessions with adaptive learning algorithms.",
      icon: <TimelineIcon sx={{ fontSize: 40, color: "#2ecc71" }} />,
    },
    {
      title: "Visual Progress",
      description: "Monitor your learning progress with clean visual charts and dashboards.",
      icon: <SchoolIcon sx={{ fontSize: 40, color: "#2ecc71" }} />,
    },
    {
      title: "Goal Focused",
      description: "Stay focused on outcomes with milestone setting and reminders.",
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#2ecc71" }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f2027", display: "flex", flexDirection: "column" }}>
      <ResponsiveAppBar />

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          py: { xs: 8, md: 12 },
          px: 3,
          textAlign: "center",
          background: "linear-gradient(to bottom right, #18232f, #1f2d3a)",
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, fontSize: { xs: "2.5rem", sm: "3.5rem" }, color: "white", mb: 2 }}>
              Welcome to <Box component="span" sx={{ color: "#2ecc71" }}>TempoLearn</Box>
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <Typography variant="h6" sx={{ color: "#bbb", mb: 4, lineHeight: 1.6 }}>
              Your intelligent study assistant. Plan smarter, stay on track, and reach your academic goals with ease.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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

      {/* Features Section */}
      <Box sx={{ backgroundColor: "#18232f", py: 8 }}>
        <Container>
          <Typography variant="h4" align="center" sx={{ color: "#fff", fontWeight: 600, mb: 4 }}>
            Why Choose TempoLearn?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ backgroundColor: "#263544", color: "#fff", textAlign: "center", minHeight: 220 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{feature.title}</Typography>
                    <Typography variant="body2" sx={{ color: "#ccc" }}>{feature.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <BottomCta />
      <Footer />
    </Box>
  );
};

export default LandingPage;
