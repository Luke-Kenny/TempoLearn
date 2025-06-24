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
      sx={{
        minWidth: isMobile ? 220 : 260,
        maxWidth: isMobile ? 240 : 280,
        height: isMobile ? 280 : 340,
        borderRadius: 6,
        backgroundColor: color,
        boxShadow: 4,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
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
            [Placeholder content for {title}]
          </Typography>

          <Box
            onClick={onToggle}
            sx={{
              mt: "auto",
              cursor: "pointer",
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
