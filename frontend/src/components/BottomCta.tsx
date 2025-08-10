import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { TOKENS as T } from "../theme/tokens";
import illustrationTempo from "../assets/illustration-tempo.jpg";

const BottomCta: React.FC = () => {
  return (
    <Box
      component="section"
      aria-labelledby="cta-heading"
      sx={{
        py: { xs: 8, md: 10 },
        background: `linear-gradient(to bottom right, ${T.colors.sectionA}, ${T.colors.sectionB})`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            alignItems: "center",
            gap: { xs: 4, md: 6 },
            p: { xs: 3, md: 4 },
            borderRadius: T.radius.lg,
            bgcolor: T.colors.panel,
            border: `1px solid ${T.colors.borderWeak}`,
            boxShadow: T.shadows.md,
            backgroundImage: `
              radial-gradient(700px 420px at -10% 20%, rgba(46,204,113,0.06) 0%, transparent 60%),
              radial-gradient(700px 420px at 110% 80%, rgba(46,204,113,0.05) 0%, transparent 60%)
            `,
          }}
        >
          {/* Text */}
          <Stack spacing={2}>
            {/* Dot + heading */}
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: T.colors.accent,
                  boxShadow: "0 0 10px rgba(46,204,113,0.35)",
                  flex: "0 0 auto",
                }}
                aria-hidden
              />
              <Typography
                id="cta-heading"
                variant="h5"
                component="h2"
                sx={{
                  color: T.colors.textPrimary,
                  fontWeight: 800,
                  letterSpacing: -0.2,
                  fontSize: { xs: "1.5rem", md: "1.8rem" },
                }}
              >
                Every class, every test — one study tool.
              </Typography>
            </Stack>

            <Typography
              variant="body1"
              sx={{ color: T.colors.textMuted, lineHeight: 1.7, maxWidth: 640 }}
            >
              Create notes, track progress, and access your study materials anytime,
              anywhere. Empower your learning with our adaptive platform.
            </Typography>
          </Stack>

          {/* Illustration */}
          <Box sx={{ display: "grid", justifyContent: { xs: "center", md: "end" } }}>
            <Box
              component="img"
              src={illustrationTempo}
              alt="Illustration: student working with TempoLearn"
              loading="lazy"
              decoding="async"
              draggable={false}
              sx={{
                width: { xs: "100%", md: 520 },
                maxWidth: "100%",
                aspectRatio: "16 / 9",
                height: "auto",
                borderRadius: T.radius.md,
                objectFit: "cover",
                border: `1px solid ${T.colors.borderWeak}`,
                boxShadow: `${T.shadows.md}, inset 0 0 0 1px ${T.colors.borderWeak}`,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BottomCta;
