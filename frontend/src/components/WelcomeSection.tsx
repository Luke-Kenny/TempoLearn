// src/components/WelcomeSection.tsx
import React, { useEffect, useState } from "react";
import { Box, Chip, Container, Typography, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import EmotionLogger from "./EmotionLogger";
import { TOKENS as T } from "../theme/tokens";

const EMOTIONS = ["Confident", "Frustrated", "Tired", "Motivated", "Overwhelmed", "Focused"];

const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  const [showEmotionDialog, setShowEmotionDialog] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("emotionPromptSeen")) {
      sessionStorage.setItem("emotionPromptSeen", "true");
    }
  }, []);

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotion(emotion.toLowerCase());
    setShowEmotionDialog(true);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        pt: { xs: 14, md: 18 },
        pb: { xs: 6, md: 6 },
        // light ambient glow behind the header block
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "90%", md: 880 },
          height: 220,
          background: `radial-gradient(60% 60% at 50% 40%, ${alpha(
            T.colors.accent,
            0.07
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      {/* Center column wrapper */}
      <Box sx={{ maxWidth: 920, mx: "auto" }}>
        {/* Heading */}
        <Stack
          component={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          spacing={1.25}
          alignItems="center"
          textAlign="center"
          sx={{ mb: { xs: 4, md: 5 } }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: -0.2,
              fontSize: { xs: "2rem", md: "2.6rem" },
              color: T.colors.textPrimary,
              lineHeight: 1.15,
            }}
          >
            {user?.email ? (
              <>
                Welcome,{" "}
                <Box
                  component="span"
                  sx={{
                    color: T.colors.accent,
                    position: "relative",
                    display: "inline-block",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -6,
                      height: 3,
                      borderRadius: 3,
                      background: alpha(T.colors.accent, 0.6),
                    },
                  }}
                >
                  {user.email}
                </Box>
                !
              </>
            ) : (
              <>
                Welcome to{" "}
                <Box component="span" sx={{ color: T.colors.accent }}>
                  TempoLearn
                </Box>
              </>
            )}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: T.colors.textMuted,
              maxWidth: 860,
              mx: "auto",
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            Your intelligent study assistant — plan smarter, track progress, and focus where it matters most.
          </Typography>

          {/* Accent rule centered */}
          <Box
            sx={{
              mt: 1.25,
              width: 160,
              height: 2,
              borderRadius: 2,
              mx: "auto",
              background: `linear-gradient(90deg, transparent, ${alpha(
                T.colors.accent,
                0.7
              )}, transparent)`,
            }}
            aria-hidden
          />
        </Stack>

        {/* Emotions */}
        <Stack alignItems="center" sx={{ mb: { xs: 4, md: 5 } }}>
          <Stack
            direction="row"
            rowGap={1}
            columnGap={1}
            flexWrap="wrap"
            justifyContent="center"
            component={motion.div}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: -6 },
              show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04 } },
            }}
            sx={{ maxWidth: 720 }}
          >
            {EMOTIONS.map((label) => (
              <Box
                key={label}
                component={motion.div}
                variants={{ hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0 } }}
              >
                <Chip
                  label={label}
                  onClick={() => handleEmotionClick(label)}
                  clickable
                  sx={{
                    color: T.colors.textPrimary,
                    backgroundColor: alpha("#fff", 0.04),
                    border: `1px solid ${alpha("#fff", 0.08)}`,
                    borderRadius: 999,
                    px: 1.5,
                    height: 34,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    transition:
                      "background-color .2s ease, border-color .2s ease, transform .15s ease",
                    "&:hover": {
                      backgroundColor: alpha(T.colors.accent, 0.12),
                      borderColor: alpha(T.colors.accent, 0.45),
                      transform: "translateY(-1px)",
                    },
                    "&:focus-visible": {
                      outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                      outlineOffset: 2,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>

          <Typography
            variant="body2"
            sx={{ mt: 1.5, color: alpha(T.colors.textMuted, 0.9) }}
          >
            How are you feeling this session?
          </Typography>
        </Stack>
      </Box>

      {/* Emotion Logger */}
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
