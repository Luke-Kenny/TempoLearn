import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../components/BackButton";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface LocationState {
  quizData: Question[];
}

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizData = (location.state as LocationState)?.quizData || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  useEffect(() => {
    if (!quizData.length) {
      navigate("/mymaterials");
    }
  }, [quizData, navigate]);

  const currentQuestion = quizData[currentIndex];

  const handleSelect = (value: string) => {
    setSelectedAnswer(value);
    setShowAnswerResult(true);

    const isCorrect = value === currentQuestion.answer;
    if (isCorrect) setScore((prev) => prev + 1);
    setAnswers((prev) => [...prev, value]);

    setTimeout(() => {
      if (currentIndex + 1 < quizData.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowAnswerResult(false);
      } else {
        setSubmitted(true);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setSubmitted(false);
    setShowAnswerResult(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        py: 10,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          borderRadius: 4,
          p: 4,
          maxWidth: 720,
          width: "100%",
        }}
      >
        {submitted ? (
          <>
            <Typography variant="h4" textAlign="center" gutterBottom>
              🎉 Quiz Complete!
            </Typography>
            <Typography variant="h6" textAlign="center" mb={3}>
              Score: {score} / {quizData.length} (
              {Math.round((score / quizData.length) * 100)}%)
            </Typography>

            <Divider sx={{ mb: 3, borderColor: "#334155" }} />

            {quizData.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.answer;
              return (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Q{idx + 1}: {q.question}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      color: isCorrect ? "#22c55e" : "#ef4444",
                    }}
                  >
                    Your Answer: {userAnswer}
                  </Typography>
                  {!isCorrect && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#facc15", fontWeight: 500 }}
                    >
                      Correct Answer: {q.answer}
                    </Typography>
                  )}
                </Box>
              );
            })}

            <Button
              fullWidth
              variant="contained"
              onClick={handleRestart}
              sx={{
                mt: 4,
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              Retake Quiz
            </Button>
            <BackButton />
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" mb={2}>
                Question {currentIndex + 1} of {quizData.length}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={((currentIndex + 1) / quizData.length) * 100}
                sx={{
                  mb: 3,
                  backgroundColor: "#334155",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#3b82f6",
                  },
                }}
              />

              <Typography
                variant="body1"
                sx={{ mb: 2, fontSize: "1.15rem", fontWeight: 500 }}
              >
                {currentQuestion?.question}
              </Typography>

              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => handleSelect(e.target.value)}
                sx={{ color: "#f1f5f9" }}
              >
                {currentQuestion.options.map((opt, idx) => {
                  const isCorrect = opt === currentQuestion.answer;
                  const isSelected = opt === selectedAnswer;

                  return (
                    <FormControlLabel
                      key={idx}
                      value={opt}
                      control={
                        <Radio
                          disabled={showAnswerResult}
                          sx={{
                            color: "#3b82f6",
                            "&.Mui-checked": {
                              color: isCorrect
                                ? "#22c55e"
                                : isSelected
                                ? "#ef4444"
                                : "#3b82f6",
                            },
                          }}
                        />
                      }
                      label={opt}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        backgroundColor:
                          showAnswerResult && isSelected
                            ? isCorrect
                              ? "#14532d"
                              : "#7f1d1d"
                            : "transparent",
                        transition: "0.3s",
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
        )}
      </Paper>
    </Box>
  );
};

export default QuizPage;
