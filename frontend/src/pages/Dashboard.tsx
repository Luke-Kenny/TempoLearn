// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Breadcrumbs,
  Link as MLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import InsightsIcon from "@mui/icons-material/Insights";
import BackButton from "../components/BackButton";
import ScoreLineChart from "../components/ScoreLineChart";
import DifficultyBreakdownChart from "../components/DifficultyBreakdownChart";
import { TOKENS as T } from "../theme/tokens";
import { getUserQuizAttempts } from "../firebase/getUserQuizAttempts";
import { useAuth } from "../context/AuthContext";

/* --------------------------- Motion helpers --------------------------- */
const BASE: Transition = { duration: 0.5, ease: T.easing.easeOut };
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { ...BASE, delay },
});

/* ----------------------- Background (page level) ---------------------- */
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
  />
);

/* --------------------------- Reusable pieces -------------------------- */
const Panel: React.FC<React.PropsWithChildren<{ as?: any; sx?: object }>> = ({
  children,
  as,
  sx,
}) => (
  <Card
    component={as || "section"}
    elevation={0}
    sx={{
      backgroundColor: T.colors.panel,
      borderRadius: T.radius.md,
      border: `1px solid ${T.colors.borderWeak}`,
      boxShadow: T.shadows.md,
      ...sx,
    }}
  >
    {children}
  </Card>
);

const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  delta?: number | null;
}> = ({ label, value, delta }) => {
  const positive = (delta ?? 0) > 0;
  const Icon = positive ? ArrowUpward : ArrowDownward;

  return (
    <Panel sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3.5 }}>
        <Typography variant="overline" sx={{ letterSpacing: 1, color: T.colors.textMuted }}>
          {label}
        </Typography>

        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: T.colors.textPrimary, lineHeight: 1 }}>
            {value}
          </Typography>

          {delta != null && delta !== 0 && (
            <Chip
              size="small"
              icon={<Icon sx={{ fontSize: 16 }} />}
              label={`${Math.abs(delta)}%`}
              sx={{
                ml: 0.5,
                fontWeight: 700,
                backgroundColor: positive ? "rgba(46,204,113,0.14)" : "rgba(255,77,77,0.12)",
                color: positive ? T.colors.accent : "#ff4d4d",
                border: `1px solid ${
                  positive ? "rgba(46,204,113,0.35)" : "rgba(255,77,77,0.35)"
                }`,
                "& .MuiChip-icon": { color: "inherit", mr: 0.5 },
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Panel>
  );
};

function DifficultyTag({ d }: { d: string }) {
  const color =
    d === "easy" ? "rgba(46,204,113,.18)" : d === "hard" ? "rgba(255,77,77,.18)" : "rgba(255,255,255,.10)";
  const border =
    d === "easy" ? "rgba(46,204,113,.45)" : d === "hard" ? "rgba(255,77,77,.45)" : "rgba(255,255,255,.25)";
  return (
    <Chip
      size="small"
      label={d[0].toUpperCase() + d.slice(1)}
      sx={{
        backgroundColor: color,
        border: `1px solid ${border}`,
        color: T.colors.textPrimary,
        fontWeight: 600,
      }}
    />
  );
}

/* -------------------------------- Page -------------------------------- */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[] | null>(null); // null = loading
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setAttempts([]);
        return;
      }
      const data = await getUserQuizAttempts(user.uid);
      if (active) setAttempts(data || []);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const { total, avg, max, last, prev } = useMemo(() => {
    const list = attempts || [];
    const total = list.length;
    const sum = list.reduce((s, a) => s + (a.percentage || 0), 0);
    const avg = total ? Math.round(sum / total) : 0;
    const max = Math.max(...list.map((a) => a.percentage || 0), 0);
    const last = list[total - 1]?.percentage ?? 0;
    const prev = list[total - 2]?.percentage ?? null;
    return { total, avg, max, last, prev };
  }, [attempts]);

  const lastDelta = prev == null ? null : Math.round(last - prev);

  const insight = useMemo(() => {
    if (!(attempts && attempts.length)) {
      return "No data yet. Take a quiz to kickstart your dashboard.";
    }
    const recent = attempts.slice(-5);
    const recAvg = Math.round(recent.reduce((s, a) => s + (a.percentage || 0), 0) / recent.length);
    const trend =
      lastDelta == null ? "—" : lastDelta > 0 ? "improving" : lastDelta < 0 ? "declining" : "flat";
    return `Recent average: ${recAvg}%. Trend appears to be ${trend}. Focus on easier difficulties if accuracy dips.`;
  }, [attempts, lastDelta]);

  return (
    <Box component="main" sx={{ bgcolor: T.colors.bg, minHeight: "100vh", position: "relative", pb: 8 }}>
      <BackgroundLayer />

      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 10 } }}>
        {/* Header */}
        <motion.div {...(prefersReducedMotion ? {} : fadeUp(0))}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ justifyContent: "center", display: "flex", mb: 1, color: T.colors.textMuted }}
          >
            <MLink underline="hover" color="inherit" href="/" aria-label="Home">
              Home
            </MLink>
            <Typography color={T.colors.textMuted}>Dashboard</Typography>
          </Breadcrumbs>

          <Typography
            variant="h3"
            component="h1"
            align="center"
            sx={{ color: T.colors.textPrimary, fontWeight: 800, letterSpacing: 0.2 }}
          >
            Your Learning Dashboard
          </Typography>
          <Typography align="center" sx={{ color: T.colors.textMuted, mt: 1 }}>
            Track progress, spot trends, and plan what to study next.
          </Typography>

          {/* Glowing underline (replaces Divider) */}
          <Box
            sx={{
              mt: 1.25,
              mx: "auto",
              width: 220,
              height: 2,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${alpha(T.colors.accent, 0.85)}, transparent)`,
              boxShadow: `
                0 0 12px ${alpha(T.colors.accent, 0.35)},
                0 0 2px  ${alpha(T.colors.accent, 0.80)}
              `,
            }}
          />
        </motion.div>

        {/* Back button row */}
        <Stack direction="row" alignItems="center" sx={{ mt: 3, mb: 2 }}>
          <BackButton />
        </Stack>

        {/* Stats row */}
        {attempts === null ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((k) => (
              <Grid key={k} item xs={12} sm={6} md={3}>
                <Panel>
                  <CardContent sx={{ p: 3.5 }}>
                    <Skeleton width={120} height={16} sx={{ mb: 1 }} />
                    <Skeleton width={80} height={40} />
                  </CardContent>
                </Panel>
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div {...(prefersReducedMotion ? {} : fadeUp(0.1))}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Total Attempts" value={total} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Average Score" value={`${avg}%`} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Highest Score" value={`${max}%`} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Last Attempt" value={`${last}%`} delta={lastDelta} />
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* Empty state */}
        {attempts && attempts.length === 0 ? (
          <Panel as="section" sx={{ p: 0, overflow: "hidden" }}>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: T.colors.textPrimary, fontWeight: 800 }}>
                No quiz attempts yet
              </Typography>
              <Typography sx={{ color: T.colors.textMuted, mt: 1.2 }}>
                Upload some notes, generate a quiz, and your progress will appear here.
              </Typography>
            </CardContent>
          </Panel>
        ) : (
          <>
            {/* Row 1: Score (wide) + Right column (Insight + smaller Difficulty) */}
            <motion.div {...(prefersReducedMotion ? {} : fadeUp(0.2))}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Left: Score Over Time */}
                <Grid item xs={12} md={8}>
                  <Panel>
                    <CardContent sx={{ p: 3.5 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: T.colors.textPrimary, fontWeight: 800, mb: 1.5 }}
                      >
                        Score Over Time
                      </Typography>

                      {/* Taller panel; chart fills it */}
                      <Box sx={{ height: { xs: 340, md: 440 } }}>
                        <ScoreLineChart attempts={attempts || []} height="100%" />
                        {/* Or with extras:
                        <ScoreLineChart attempts={attempts || []} height="100%" target={80} movingAvgWindow={3} />
                        */}
                      </Box>
                    </CardContent>
                  </Panel>
                </Grid>

                {/* Right: Quick Insight + Difficulty (smaller) */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={3} sx={{ height: "100%" }}>
                    <Panel>
                      <CardContent sx={{ p: 3.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <InsightsIcon sx={{ color: T.colors.accent }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: T.colors.textPrimary }}>
                            Quick Insight
                          </Typography>
                        </Stack>
                        <Typography sx={{ color: T.colors.textMuted, lineHeight: 1.6 }}>
                          {insight}
                        </Typography>
                      </CardContent>
                    </Panel>

                    <Panel>
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{ color: T.colors.textPrimary, fontWeight: 800, mb: 1.25 }}
                        >
                          Difficulty Breakdown
                        </Typography>
                        <Box sx={{ height: { xs: 220, md: 260 } }}>
                          <DifficultyBreakdownChart attempts={attempts || []} />
                        </Box>
                      </CardContent>
                    </Panel>
                  </Stack>
                </Grid>
              </Grid>
            </motion.div>

            {/* Row 2: Recent Attempts full width */}
            <motion.div {...(prefersReducedMotion ? {} : fadeUp(0.3))}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Panel>
                    <CardContent sx={{ p: 3.5 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: T.colors.textPrimary, fontWeight: 800, mb: 1.5 }}
                      >
                        Recent Attempts
                      </Typography>
                      <TableContainer>
                        <Table size="small" aria-label="Recent attempts">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: T.colors.textMuted }}>Quiz</TableCell>
                              <TableCell sx={{ color: T.colors.textMuted }}>Difficulty</TableCell>
                              <TableCell sx={{ color: T.colors.textMuted }} align="right">
                                Score
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(attempts || [])
                              .slice(-5)
                              .reverse()
                              .map((a, i) => {
                                const diff = (a?.difficulty || "medium").toLowerCase();
                                const score = a?.percentage ?? 0;
                                return (
                                  <TableRow key={i} hover tabIndex={0}>
                                    <TableCell sx={{ color: T.colors.textPrimary }}>
                                      {a?.topic || `Quiz ${i + 1}`}
                                    </TableCell>
                                    <TableCell>
                                      <DifficultyTag d={diff} />
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: T.colors.textPrimary, fontWeight: 700 }}>
                                      {score}%
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            {!(attempts && attempts.length) && (
                              <TableRow>
                                <TableCell colSpan={3} sx={{ color: T.colors.textMuted }}>
                                  Nothing to show yet.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Panel>
                </Grid>
              </Grid>
            </motion.div>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
