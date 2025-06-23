import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StyleIcon from "@mui/icons-material/Style";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const toggleExpand = (title: string) => {
    setExpandedCard((prev) => (prev === title ? null : title));
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const cardData = [
    {
      title: "Your Courses",
      icon: <SchoolIcon fontSize="large" />,
      color: "#e3f2fd",
      details:
        "Manage and view your enrolled courses. Placeholder: course tracking, assignments, due dates, etc.",
    },
    {
      title: "Study Sets",
      icon: <MenuBookIcon fontSize="large" />,
      color: "#fde2e4",
      details:
        "Create, edit, or browse study sets. Placeholder: categories, topics, or recent additions.",
    },
    {
      title: "Flashcards",
      icon: <StyleIcon fontSize="large" />,
      color: "#fff3e0",
      details:
        "Use interactive flashcards. Placeholder: quiz modes, review progress, spaced repetition.",
    },
    {
      title: "Progress Tracker",
      icon: <ShowChartIcon fontSize="large" />,
      color: "#e8f5e9",
      details:
        "Track learning milestones. Placeholder: stats, charts, and achievements.",
    },
    {
      title: "Practice Tests",
      icon: <ShowChartIcon fontSize="large" />,
      color: "#ffe0b2",
      details:
        "Take timed quizzes. Placeholder: auto-generated questions, retry modes, score tracking.",
    },
    {
      title: "Expert Solutions",
      icon: <MenuBookIcon fontSize="large" />,
      color: "#b2f2bb",
      details:
        "Step-by-step expert guides. Placeholder: math, science, history, more.",
    },
    {
      title: "Study Guides",
      icon: <StyleIcon fontSize="large" />,
      color: "#f3e5f5",
      details:
        "Summarized reference content. Placeholder: quick notes, key dates, diagrams.",
    },
    {
      title: "Daily Challenges",
      icon: <SchoolIcon fontSize="large" />,
      color: "#d1c4e9",
      details: "Get new questions daily. Placeholder: streaks, rewards, XP.",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <ResponsiveAppBar />

      <Container sx={{ pt: 14, pb: 6, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, <span style={{ color: "#2ecc71" }}>{user?.email}</span>!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Choose a section to begin studying.
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            backgroundColor: "#ff4d4d",
            "&:hover": { backgroundColor: "#cc0000" },
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Logout
        </Button>
      </Container>

      {/* Arrow buttons */}
      <Box sx={{ position: "relative", px: 2, pb: 6 }}>
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollContainerRef}
          sx={{
            overflowX: "auto",
            display: "flex",
            gap: 3,
            scrollSnapType: "x mandatory",
            px: 6,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {cardData.map(({ title, icon, color, details }) => (
            <Box
              key={title}
              sx={{
                minWidth: 280,
                maxWidth: 300,
                flexShrink: 0,
                scrollSnapAlign: "start",
                borderRadius: 4,
                backgroundColor: color,
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Card elevation={0} sx={{ backgroundColor: color }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Box mb={1}>{icon}</Box>
                  <Typography variant="h6" fontWeight="bold">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    [Placeholder content for {title}]
                  </Typography>
                  <IconButton
                    onClick={() => toggleExpand(title)}
                    sx={{ mt: 1 }}
                    aria-label={`Toggle ${title} details`}
                  >
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          expandedCard === title
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </IconButton>
                  <Collapse
                    in={expandedCard === title}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {details}
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ backgroundColor: "white", py: 10 }}>
        <Container>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={6}
            alignItems="center"
          >
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Every class, every test — one study tool.
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Create flashcards, track progress, and access your study
                materials anytime, anywhere. Empower your learning with our
                adaptive platform.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, backgroundColor: "#3f51b5" }}
              >
                Learn More
              </Button>
            </Box>
            <Box
              flex={1}
              sx={{
                width: "100%",
                height: 250,
                backgroundColor: "#e3f2fd",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#90caf9",
                fontWeight: "bold",
              }}
            >
              [Illustration/Image Placeholder]
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
