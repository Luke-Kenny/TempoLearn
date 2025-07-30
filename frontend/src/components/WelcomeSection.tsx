import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EmotionLogger from "./EmotionLogger";

const emotionChips = ["Confident", "Frustrated", "Tired", "Motivated", "Overwhelmed", "Focused"];

const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showEmotionDialog, setShowEmotionDialog] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const handleTempoStudyClick = () => navigate("/tempostudy");
  const handleMyNotesClick = () => navigate("/mymaterials");

  useEffect(() => {
    const seen = sessionStorage.getItem("emotionPromptSeen");
    if (!seen) {
      sessionStorage.setItem("emotionPromptSeen", "true");
    }
  }, []);

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion.toLowerCase());
    setShowEmotionDialog(true);
  };

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 18, sm: 22 }, pb: 10 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={700}
          textAlign="center"
          sx={{ fontSize: { xs: "2rem", sm: "2.75rem" }, mb: 2, color: "#ffffff" }}
        >
          Welcome to{" "}
          <Box component="span" sx={{ color: "#2ecc71" }}>
            TempoLearn
          </Box>
          {user?.email ? ` ${user.email}!` : "!"}
        </Typography>

        <Divider
          sx={{
            mb: 3,
            maxWidth: 160,
            mx: "auto",
            borderColor: "#2ecc71",
            opacity: 0.8,
          }}
        />

        <Typography
          variant="h6"
          textAlign="center"
          sx={{
            color: "#bbb",
            maxWidth: 720,
            mx: "auto",
            fontWeight: 400,
            lineHeight: 1.6,
            mb: 4,
          }}
        >
          Your intelligent study assistant — plan smarter, track progress, and
          focus where it matters most.
        </Typography>

        {/* Emotion Chips Row */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={1.5}
          mb={5}
        >
          {emotionChips.map((label) => (
            <Chip
              key={label}
              label={label}
              onClick={() => handleEmotionClick(label)}
              sx={{
                backgroundColor: "#334155",
                color: "#f1f5f9",
                fontWeight: 500,
                borderRadius: "1.5rem",
                px: 2,
                py: 0.5,
                "&:hover": {
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                },
                cursor: "pointer",
                transition: "0.3s",
              }}
            />
          ))}
        </Box>
      </motion.div>

      {/* Button Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
          <Button
            variant="contained"
            onClick={handleTempoStudyClick}
            sx={{
              backgroundColor: "#2d9cdb",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "999px",
              px: 6,
              py: 1.6,
              fontSize: "1.05rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "#238ac9",
              },
            }}
          >
            TempoStudy
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300 }}>
          <Button
            variant="outlined"
            onClick={handleMyNotesClick}
            sx={{
              color: "#ffffff",
              borderColor: "#2ecc71",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "999px",
              px: 6,
              py: 1.6,
              fontSize: "1.05rem",
              "&:hover": {
                borderColor: "#27ae60",
                backgroundColor: "rgba(46, 204, 113, 0.1)",
              },
            }}
          >
            My Notes
          </Button>
        </motion.div>
      </Box>

      {/* EmotionLogger Dialog */}
      {showEmotionDialog && (
        <EmotionLogger
          open={showEmotionDialog}
          onClose={() => {
            setShowEmotionDialog(false);
            setSelectedEmotion("");
          }}
          materialId={undefined}
          defaultEmotion={selectedEmotion} 
          onLogged={() => {}}
        />
      )}
    </Container>
  );
};

export default WelcomeSection;
