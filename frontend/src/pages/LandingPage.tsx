// src/pages/LandingPage.tsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, type Transition, useReducedMotion } from "framer-motion";
import { TOKENS as T } from "../theme/tokens";
import Footer from "../components/Footer";

import SchoolIcon from "@mui/icons-material/School";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/* ------------------------------- Data ------------------------------- */
type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const FEATURES: Feature[] = [
  {
    title: "AI Quiz Generation",
    description:
      "Upload your notes and generate personalized quizzes tailored to your goals.",
    icon: TimelineIcon,
  },
  {
    title: "Smart Note Summarization",
    description:
      "Get concise summaries, key concepts, and visual suggestions — directly from your uploaded material.",
    icon: SchoolIcon,
  },
  {
    title: "Progress & Emotion Tracking",
    description:
      "Review quiz history and trends, and log your mood to build awareness and motivation.",
    icon: CheckCircleIcon,
  },
];

/* ---------------------------- Motion setup --------------------------- */
const BASE_TRANSITION: Transition = { duration: 0.55, ease: T.easing.easeOut };

/* ---------------------- Background (global layer) ---------------------- */
/** One continuous gradient for the entire page. Sections are transparent. */
const BackgroundLayer: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: -1,
      background: `linear-gradient(to bottom right, ${T.colors.heroA}, ${T.colors.heroB})`,
      "&:after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(120% 85% at 50% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.24) 100%)",
        pointerEvents: "none",
      },
    }}
  >
    {/* Subtle, brand-colored orbs */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        "& > .orb": {
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(48px)",
          opacity: 0.22,
          background:
            "radial-gradient(circle at 30% 30%, rgba(46,204,113,0.7), rgba(46,204,113,0) 60%)",
        },
      }}
    >
      <Box className="orb" sx={{ width: 360, height: 360, top: 64, left: -120 }} />
      <Box className="orb" sx={{ width: 300, height: 300, top: 96, right: -80 }} />
      <Box className="orb" sx={{ width: 260, height: 260, bottom: -80, left: 80, opacity: 0.18 }} />
    </Box>
  </Box>
);

/* -------------------------------- HERO -------------------------------- */
const Hero: React.FC<{ onPrimary: () => void; onSecondary: () => void }> = ({
  onPrimary,
  onSecondary,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: BASE_TRANSITION };

  return (
    <Box component="section" sx={{ position: "relative", overflow: "hidden", py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={9}>
            <motion.div {...fadeUp}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  color: T.colors.textPrimary,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  lineHeight: 1.05,
                  fontSize: {
                    xs: "clamp(2.25rem, 6.5vw, 3rem)",
                    md: "clamp(3rem, 6vw, 4rem)",
                  },
                }}
              >
                Welcome to{" "}
                <Box component="span" sx={{ color: T.colors.accent }}>
                  TempoLearn
                </Box>
              </Typography>
            </motion.div>

            <motion.div {...(prefersReducedMotion ? {} : { ...fadeUp, transition: { ...BASE_TRANSITION, delay: 0.12 } })}>
              <Typography
                variant="h6"
                sx={{
                  color: T.colors.textMuted,
                  fontWeight: 400,
                  lineHeight: 1.75,
                  mt: 2,
                  maxWidth: 720,
                }}
              >
                Your intelligent study assistant. Learn faster, stay focused, and
                reach your academic milestones with ease and structure.
              </Typography>
            </motion.div>

            <motion.div {...(prefersReducedMotion ? {} : { ...fadeUp, transition: { ...BASE_TRANSITION, delay: 0.24 } })}>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={onPrimary}
                  aria-label="Get started with TempoLearn"
                  sx={{
                    backgroundColor: T.colors.accent,
                    color: "#0d0f12",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 999,
                    px: 3.5,
                    py: 1.2,
                    boxShadow: T.shadows.md,
                    "&:hover": { backgroundColor: T.colors.accentHover },
                    "&:focus-visible": {
                      outline: `3px solid rgba(46,204,113,.35)`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  onClick={onSecondary}
                  aria-label="Scroll to features"
                  sx={{
                    borderColor: T.colors.border,
                    color: T.colors.textPrimary,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 999,
                    px: 3,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.45)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    },
                    "&:focus-visible": {
                      outline: `3px solid rgba(255,255,255,.25)`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  See how it works
                </Button>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Gentle fade into the next section (no hard band) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 60%, rgba(0,0,0,0.22) 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

/* -------------------------- FEATURE CARD -------------------------- */
const FeatureCard: React.FC<{ feature: Feature; delay: number; accent?: boolean }> = ({
  feature,
  delay,
  accent,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Icon = feature.icon;

  return (
    <motion.div
      {...(prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.35 },
            transition: { duration: 0.45, ease: T.easing.easeOut, delay },
          })}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          backgroundColor: T.colors.panel,
          borderRadius: T.radius.md, // squarer = cleaner
          textAlign: "left",
          minHeight: 240,
          border: `1px solid ${T.colors.borderWeak}`,
          boxShadow: T.shadows.md,
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 3,
            borderTopLeftRadius: T.radius.md,
            borderBottomLeftRadius: T.radius.md,
            background: `linear-gradient(${T.colors.accent}, ${T.colors.accent}20)`,
            opacity: accent ? 0.95 : 0.6,
            transition: "opacity .2s ease",
          },
          transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: T.shadows.lg,
            borderColor: "rgba(46, 204, 113, 0.45)",
            "&:before": { opacity: 1 },
          },
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: T.radius.md,
                display: "grid",
                placeItems: "center",
                backgroundColor: "rgba(46,204,113,0.12)",
                border: "1px solid rgba(46,204,113,0.35)",
              }}
              aria-hidden
            >
              <Icon sx={{ fontSize: 26, color: T.colors.accent }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: T.colors.textPrimary, lineHeight: 1.25 }}
            >
              {feature.title}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: T.colors.textMuted, fontSize: "0.95rem", lineHeight: 1.6 }}
          >
            {feature.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* -------------------------------- PAGE -------------------------------- */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        bgcolor: T.colors.bg, // theme token; visual bg comes from BackgroundLayer
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <BackgroundLayer />

      <Hero
        onPrimary={() => navigate("/signin")}
        onSecondary={() =>
          document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <Box
        id="features-section"
        component="section"
        aria-labelledby="features-heading"
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 9 },
        }}
      >
        {/* Subtle divider shimmer for separation (no color band) */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
            opacity: 0.25,
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{
              display: "block",
              textAlign: "center",
              mb: 1,
              letterSpacing: 1.2,
              color: T.colors.textMuted,
            }}
          >
            Document-driven, adaptive microlearning
          </Typography>

          <Typography
            id="features-heading"
            variant="h3"
            component="h2"
            align="center"
            sx={{
              color: T.colors.textPrimary,
              fontWeight: 800,
              mb: 6,
              letterSpacing: 0.2,
              lineHeight: 1.1,
            }}
          >
            Why Choose TempoLearn?
          </Typography>

          <Grid container spacing={4}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} md={4} key={f.title}>
                <FeatureCard feature={f} delay={i * 0.12} accent={i === 0} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default LandingPage;
