import React from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  sx?: object;
}

const BackButton: React.FC<BackButtonProps> = ({ to = "/home", label = "Back", sx = {} }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 3 },
        pl: { xs: 1, sm: 2 },
        ...sx,
      }}
    >
      <Tooltip title={label}>
        <IconButton
          onClick={() => navigate(to)}
          aria-label={label}
          sx={{
            color: "#f8fafc",
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#334155",
            },
            transition: "background-color 0.3s",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default BackButton;
