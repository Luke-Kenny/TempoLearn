import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import SummaryCard from "../components/SummaryCard";
import ScoreLineChart from "../components/ScoreLineChart";
import DifficultyBreakdownChart from "../components/DifficultyBreakdownChart";
import { getUserQuizAttempts } from "../firebase/getUserQuizAttempts";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (user) {
        const data = await getUserQuizAttempts(user.uid);
        setAttempts(data || []);
      }
    };
    fetchAttempts();
  }, [user]);

  const totalAttempts = attempts.length;
  const avgScore = totalAttempts
    ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts)
    : 0;
  const highestScore = Math.max(...attempts.map(a => a.percentage || 0), 0);
  const lastScore = attempts[attempts.length - 1]?.percentage || 0;

  return (
    <Box
      sx={{
        backgroundColor: "#0f2027",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, sm: 6 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="#f8fafc"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Your Learning Dashboard
        </Typography>
        <Divider sx={{ borderColor: "#2ecc71", maxWidth: 180, mx: "auto", mb: 4 }} />
      </motion.div>

      <BackButton />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Grid container spacing={3} justifyContent="center" mb={5}>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard title="Total Attempts" value={totalAttempts} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard title="Average Score" value={`${avgScore}%`} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard title="Highest Score" value={`${highestScore}%`} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard title="Last Attempt" value={`${lastScore}%`} />
          </Grid>
        </Grid>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Box
          sx={{
            backgroundColor: "#18232f",
            borderRadius: 3,
            p: 3,
            mb: 5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h6" color="#f8fafc" mb={2}>
            Score Over Time
          </Typography>
          <ScoreLineChart attempts={attempts} />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Box
          sx={{
            backgroundColor: "#18232f",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h6" color="#f8fafc" mb={2}>
            Difficulty Breakdown
          </Typography>
          <DifficultyBreakdownChart attempts={attempts} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
