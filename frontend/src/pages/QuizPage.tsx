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
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { saveQuizAttempt } from "../utils/saveQuizAttempt";
import BackButton from "../components/BackButton";
import EmotionLogger from "../components/EmotionLogger";

type Question = {
  type: "mcq" | "true_false" | "cloze" | "short_answer";
  question: string;
  options?: string[];
  answer: string | boolean;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  cognitive_level: string;
};

interface LocationState {
  quizData: Question[];
  materialId: string;
}

const normalize = (input: string | boolean) => {
  if (typeof input === "boolean") return input;
  return input.trim().toLowerCase().replace(/[^\w\s]/gi, "");
};

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { quizData, materialId } = location.state as LocationState;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean>("");
  const [answers, setAnswers] = useState<(string | boolean)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [shortAnswerText, setShortAnswerText] = useState("");
  const [showEmotionDialog, setShowEmotionDialog] = useState(false);

  useEffect(() => {
    if (!quizData?.length || !materialId) navigate("/mymaterials");
  }, [quizData, materialId, navigate]);

  const currentQuestion = quizData[currentIndex];

  const handleSelect = async (value: string | boolean) => {
    setSelectedAnswer(value);
    setShowAnswerResult(true);

    const isCorrect = normalize(value) === normalize(currentQuestion.answer);
    if (isCorrect) setScore((prev) => prev + 1);
    setAnswers((prev) => [...prev, value]);

    setTimeout(async () => {
      if (currentIndex + 1 < quizData.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer("");
        setShortAnswerText("");
        setShowAnswerResult(false);
      } else {
        setSubmitted(true);
        if (user) {
          const finalScore = isCorrect ? score + 1 : score;
          const finalAnswers = [...answers, value];
          const percentage = Math.round((finalScore / quizData.length) * 100);

          await saveQuizAttempt({
            uid: user.uid,
            materialId,
            score: finalScore,
            total: quizData.length,
            percentage,
            answers: quizData.map((q, index) => ({
              question: q.question,
              type: q.type,
              correctAnswer: q.answer,
              userAnswer: finalAnswers[index],
              isCorrect: normalize(finalAnswers[index]) === normalize(q.answer),
              difficulty: q.difficulty,
              cognitive_level: q.cognitive_level,
              explanation: q.explanation || null,
              options: q.options || null,
            })),
          });

          setShowEmotionDialog(true);
        }
      }
    }, 800);
  };

  const handleShortAnswerSubmit = () => {
    if (!shortAnswerText.trim()) return;
    handleSelect(shortAnswerText.trim());
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setShortAnswerText("");
    setScore(0);
    setAnswers([]);
    setSubmitted(false);
    setShowAnswerResult(false);
    setShowEmotionDialog(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0f2027",
        minHeight: "100vh",
        py: 10,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: "#18232f",
          color: "#f8fafc",
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          maxWidth: 720,
          width: "100%",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        }}
      >
        {submitted ? (
          <>
            <Typography
              variant="h4"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Quiz Complete!
            </Typography>

            <Typography
              variant="h6"
              textAlign="center"
              mb={3}
              sx={{ color: "#2ecc71", fontWeight: 600 }}
            >
              Score: {score} / {quizData.length} ({Math.round((score / quizData.length) * 100)}%)
            </Typography>

            {showEmotionDialog && user && (
              <EmotionLogger
                open={showEmotionDialog}
                onClose={() => setShowEmotionDialog(false)}
                materialId={materialId}
              />
            )}

            <Divider sx={{ my: 3, borderColor: "#334155" }} />

            {quizData.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = normalize(userAnswer) === normalize(q.answer);
              return (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Q{idx + 1}: {q.question}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: isCorrect ? "#22c55e" : "#ef4444" }}
                  >
                    Your Answer: {String(userAnswer)}
                  </Typography>
                  {!isCorrect && (
                    <Typography variant="body2" sx={{ color: "#facc15", fontWeight: 500 }}>
                      Correct Answer: {String(q.answer)}
                    </Typography>
                  )}
                  {q.explanation && (
                    <Typography variant="body2" sx={{ color: "#38bdf8", fontStyle: "italic" }}>
                      Explanation: {q.explanation}
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
                textTransform: "none",
                fontWeight: 600,
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
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
            >
              <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>
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
                sx={{
                  mb: 2,
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                {currentQuestion?.question}
              </Typography>

              {currentQuestion.type === "mcq" && currentQuestion.options && (
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => handleSelect(e.target.value)}
                  sx={{ color: "#f1f5f9" }}
                >
                  {currentQuestion.options.map((opt, idx) => {
                    const isCorrect = normalize(opt) === normalize(currentQuestion.answer);
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
              )}

              {currentQuestion.type === "true_false" && (
                <Box display="flex" gap={2}>
                  {["True", "False"].map((val) => {
                    const boolVal = val === "True";
                    const isCorrect = boolVal === currentQuestion.answer;
                    const isSelected = selectedAnswer === boolVal;
                    return (
                      <Button
                        key={val}
                        variant="outlined"
                        disabled={showAnswerResult}
                        onClick={() => handleSelect(boolVal)}
                        sx={{
                          color: "#f8fafc",
                          borderColor: "#3b82f6",
                          backgroundColor:
                            showAnswerResult && isSelected
                              ? isCorrect
                                ? "#14532d"
                                : "#7f1d1d"
                              : "transparent",
                          "&:hover": {
                            backgroundColor: "#1e40af",
                          },
                          fontWeight: 500,
                          px: 3,
                          py: 1,
                        }}
                      >
                        {val}
                      </Button>
                    );
                  })}
                </Box>
              )}

              {["short_answer", "cloze"].includes(currentQuestion.type) && (
                <Box>
                  <TextField
                    fullWidth
                    placeholder="Type your answer"
                    value={shortAnswerText}
                    onChange={(e) => setShortAnswerText(e.target.value)}
                    sx={{
                      backgroundColor: "#f8fafc",
                      borderRadius: 2,
                      mb: 2,
                      input: { color: "#0f172a" },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleShortAnswerSubmit}
                    disabled={showAnswerResult || !shortAnswerText.trim()}
                    sx={{
                      backgroundColor: "#3b82f6",
                      "&:hover": { backgroundColor: "#2563eb" },
                      fontWeight: 600,
                    }}
                  >
                    Submit Answer
                  </Button>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </Paper>
    </Box>
  );
};

export default QuizPage;
