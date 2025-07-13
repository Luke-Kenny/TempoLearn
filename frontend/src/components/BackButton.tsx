import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string; 
  label?: string; 
}

const BackButton: React.FC<BackButtonProps> = ({ to = "/home", label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={() => navigate(to)}
        sx={{
          color: "#ffffff",
          position: "absolute",
          top: 80,
          left: 30,
          zIndex: 2000,
          backgroundColor: "#1e293b", // optional debug color
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
