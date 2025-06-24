import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StyleIcon from "@mui/icons-material/Style";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export const cardData = [
  {
    title: "Your Courses",
    icon: <SchoolIcon fontSize="large" />,
    color: "#4B7BE5", // Balanced soft blue (no overlap)
    details: "Manage and view your enrolled courses.",
  },
  {
    title: "Practice Quiz",
    icon: <MenuBookIcon fontSize="large" />,
    color: "#EF476F", // Warm rose-red (high energy)
    details: "Hone your skills.",
  },
  {
    title: "Flashcards",
    icon: <StyleIcon fontSize="large" />,
    color: "#9D4EDD", // Lavender purple (unique from others)
    details: "Use flashcards for spaced repetition.",
  },
  {
    title: "Progress Tracker",
    icon: <ShowChartIcon fontSize="large" />,
    color: "#06A77D", // Deep teal green (great contrast)
    details: "Track milestones and view learning stats.",
  },
  {
    title: "Settings",
    icon: <AssignmentIcon fontSize="large" />,
    color: "#6C757D", // Slate gray (neutral for system settings)
    details: "Adjust your profile settings.",
  },
  {
    title: "Expert Solutions",
    icon: <AutoStoriesIcon fontSize="large" />,
    color: "#F8961E", // Muted orange (warm & professional)
    details: "Step-by-step solutions.",
  },
  {
    title: "Study Guides",
    icon: <FlashOnIcon fontSize="large" />,
    color: "#118AB2", // Strong cyan (well-balanced)
    details: "Concise summaries and quick notes.",
  },
  {
    title: "Daily Challenges",
    icon: <EmojiEventsIcon fontSize="large" />,
    color: "#3A0CA3", // Rosy pink (engaging, motivational)
    details: "Boost consistency with daily goals.",
  },
];
