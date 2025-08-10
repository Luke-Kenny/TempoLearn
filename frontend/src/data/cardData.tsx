// src/data/cardData.ts
import SchoolIcon from "@mui/icons-material/School";
import DescriptionIcon from "@mui/icons-material/Description";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export type NavCard = {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  route: string;          // ← add this
  ctaLabel?: string;
};

export const cardData: NavCard[] = [
  {
    title: "Uploads",
    icon: <SchoolIcon fontSize="large" />,
    color: "#4B7BE5",
    description: "Upload and manage your course materials.",
    route: "/tempostudy",
  },
  {
    title: "Notes",
    icon: <DescriptionIcon fontSize="large" />,
    color: "#23CE6B",
    description: "Create, edit, and organize your study notes.",
    route: "/mymaterials",
  },
  {
    title: "Dashboard",
    icon: <ShowChartIcon fontSize="large" />,
    color: "#F1A208",
    description: "Track your progress and trends at a glance.",
    route: "/dashboard",
  },
];
