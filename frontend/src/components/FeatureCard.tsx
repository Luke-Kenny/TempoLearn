// src/components/FeatureCard.tsx

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  details: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const getSummaryForTitle = (title: string): string => {
  switch (title) {
    case "Your Courses":
      return "View and organize your enrolled subjects.";
    case "Practice Quiz":
      return "Quick tests tailored to your study sets.";
    case "Flashcards":
      return "Memory-boosting tools for key concepts.";
    case "Progress Tracker":
      return "Visualize learning milestones and habits.";
    case "Settings":
      return "Customize your learning preferences.";
    case "Expert Solutions":
      return "Step-by-step answers to hard problems.";
    case "Study Guides":
      return "Concise summaries for rapid revision.";
    case "Daily Challenges":
      return "New prompts to keep your streak alive.";
    default:
      return "Explore this feature to learn more.";
  }
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  color,
  details,
  isExpanded,
  onToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      onClick={onToggle}
      sx={{
        width: 320, // Fixed to match CARD_WIDTH in CardCarousel
        height: isMobile ? 280 : 340,
        borderRadius: 6,
        backgroundColor: color,
        boxShadow: 4,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
        cursor: "pointer",
      }}
    >
      <Card
        elevation={0}
        sx={{
          backgroundColor: color,
          color: "#fff",
          borderRadius: 6,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            paddingBottom: 2,
            px: 2,
          }}
        >
          <Box sx={{ mb: 1 }}>{icon}</Box>

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="#ddd"
            sx={{ mb: 1, textAlign: "center" }}
            noWrap
          >
            {getSummaryForTitle(title)}
          </Typography>

          <Box
            sx={{
              mt: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              pt: 1,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <ExpandMoreIcon
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                fontSize: 28,
              }}
            />
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Typography
                variant="body2"
                color="#ccc"
                sx={{
                  mt: 1,
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                {details}
              </Typography>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeatureCard;
