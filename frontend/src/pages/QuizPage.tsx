// src/pages/QuizPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  LinearProgress,
  Divider,
  TextField,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";

import { useAuth } from "../context/AuthContext";
import { saveQuizAttempt } from "../utils/saveQuizAttempt";
import BackButton from "../components/BackButton";
import EmotionLogger from "../components/EmotionLogger";
import { TOKENS as T } from "../theme/tokens";

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

const diffColor = (d: Question["difficulty"]) =>
  d === "easy" ? "#86efac" : d === "hard" ? "#fca5a5" : "#93c5fd";

const Panel: React.FC<React.PropsWithChildren<{ sx?: object }>> = ({ children, sx }) => (
  <Card
    elevation={0}
    sx={{
      backgroundColor: T.colors.panel,
      border: `1px solid ${T.colors.borderWeak}`,
      borderRadius: T.radius.lg,
      boxShadow: T.shadows.lg,
      ...sx,
    }}
  >
    {children}
  </Card>
);

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { quizData, materialId } = (location.state || {}) as LocationState;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean>("");
  const [answers, setAnswers] = useState<(string | boolean)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [shortAnswerText, setShortAnswerText] = useState("");
  const [showEmotionDialog, setShowEmotionDialog] = useState(false);
  const [startedAt] = useState<number>(() => Date.now());

  const currentQuestion: Question | undefined = useMemo(
    () => (quizData ? quizData[currentIndex] : undefined),
    [quizData, currentIndex]
  );

  const total = quizData?.length || 0;
  const progress = total ? ((currentIndex + 1) / total) * 100 : 0;
  const timeElapsedSec = Math.max(0, Math.round((Date.now() - startedAt) / 1000));

  const groupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!quizData?.length || !materialId) navigate("/mymaterials");
  }, [quizData, materialId, navigate]);

  useEffect(() => {
    groupRef.current?.focus();
  }, [currentIndex]);

  const goNext = (value: string | boolean) => {
    const isCorrect = normalize(value) === normalize(currentQuestion!.answer);
    if (isCorrect) setScore((prev) => prev + 1);
    setAnswers((prev) => [...prev, value]);
    setShowAnswerResult(true);

    setTimeout(async () => {
      if (currentIndex + 1 < total) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer("");
        setShortAnswerText("");
        setShowAnswerResult(false);
      } else {
        setSubmitted(true);
        if (user) {
          const finalScore = isCorrect ? score + 1 : score;
          const finalAnswers = [...answers, value];
          const percentage = Math.round((finalScore / total) * 100);

          await saveQuizAttempt({
            uid: user.uid,
            materialId,
            score: finalScore,
            total,
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
    }, 680);
  };

  const handleSelect = (value: string | boolean) => {
    setSelectedAnswer(value);
    goNext(value);
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
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (!currentQuestion || submitted) return;
    if (currentQuestion.type === "mcq" && currentQuestion.options) {
      const idx = parseInt(e.key, 10);
      if (!Number.isNaN(idx) && idx >= 1 && idx <= currentQuestion.options.length) {
        handleSelect(currentQuestion.options[idx - 1]);
      }
    } else if ((currentQuestion.type === "cloze" || currentQuestion.type === "short_answer") && e.key === "Enter") {
      handleShortAnswerSubmit();
    } else if (currentQuestion.type === "true_false") {
      if (e.key.toLowerCase() === "t") handleSelect(true);
      if (e.key.toLowerCase() === "f") handleSelect(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: T.colors.bg,
        background: `radial-gradient(900px 600px at 20% 0%, rgba(46,204,113,0.06) 0%, transparent 70%),
                     radial-gradient(800px 500px at 80% 15%, rgba(45,156,219,0.05) 0%, transparent 65%),
                     linear-gradient(to bottom right, ${T.colors.heroA}, ${T.colors.heroB})`,
        // Center the card vertically & horizontally
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Allow scrolling when results are long
        overflowY: "auto",
        px: 2,
        py: 4,
      }}
    >
      <Panel
        sx={{
          width: "min(960px, 92vw)",
          // Keep the card from exceeding viewport height when content is huge
          maxHeight: { xs: "none", md: "calc(100vh - 48px)" },
          overflow: "auto",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BoltRounded sx={{ color: T.colors.accent }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: T.colors.textPrimary }}>
                {submitted ? "Quiz Summary" : `Question ${currentIndex + 1} of ${total}`}
              </Typography>
            </Stack>
            {!submitted && currentQuestion && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title="Elapsed time">
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: T.colors.textMuted }}>
                    <AccessTimeRounded fontSize="small" />
                    <Typography variant="body2">
                      {Math.floor(timeElapsedSec / 60)}:{String(timeElapsedSec % 60).padStart(2, "0")}
                    </Typography>
                  </Stack>
                </Tooltip>
                <Chip
                  size="small"
                  label={currentQuestion.difficulty.toUpperCase()}
                  sx={{
                    fontWeight: 700,
                    color: diffColor(currentQuestion.difficulty),
                    borderColor: alpha(diffColor(currentQuestion.difficulty), 0.5),
                    bgcolor: alpha(diffColor(currentQuestion.difficulty), 0.12),
                    border: `1px solid ${alpha(diffColor(currentQuestion.difficulty), 0.4)}`,
                  }}
                />
              </Stack>
            )}
          </Stack>

          {/* Progress */}
          {!submitted && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mb: 3,
                height: 8,
                borderRadius: 999,
                backgroundColor: alpha("#fff", 0.06),
                "& .MuiLinearProgress-bar": {
                  background: `linear-gradient(90deg, ${alpha(T.colors.accent, 0.7)}, ${T.colors.accent})`,
                  boxShadow: `0 0 10px ${alpha(T.colors.accent, 0.35)}`,
                },
              }}
            />
          )}

          {/* Content */}
          {submitted ? (
            <>
              <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: T.colors.textPrimary, mb: 0.5 }}>
                Quiz Complete!
              </Typography>
              <Typography align="center" sx={{ color: T.colors.textMuted, mb: 3 }}>
                Score:{" "}
                <b style={{ color: "#22c55e" }}>
                  {score} / {total} ({Math.round((score / total) * 100)}%)
                </b>
              </Typography>

              {showEmotionDialog && user && (
                <EmotionLogger open={showEmotionDialog} onClose={() => setShowEmotionDialog(false)} materialId={materialId} />
              )}

              <Divider sx={{ borderColor: T.colors.borderWeak, mb: 2 }} />

              <Stack spacing={2.5}>
                {quizData.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = normalize(userAnswer) === normalize(q.answer);
                  return (
                    <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: alpha("#fff", 0.02) }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        {isCorrect ? <CheckRounded sx={{ color: "#22c55e" }} /> : <CloseRounded sx={{ color: "#ef4444" }} />}
                        <Typography sx={{ fontWeight: 700, color: T.colors.textPrimary }}>
                          Q{idx + 1}: {q.question}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: isCorrect ? "#22c55e" : "#ef4444" }}>
                        Your Answer: <b>{String(userAnswer)}</b>
                      </Typography>
                      {!isCorrect && (
                        <Typography variant="body2" sx={{ color: "#fbbf24" }}>
                          Correct Answer: <b>{String(q.answer)}</b>
                        </Typography>
                      )}
                      {q.explanation && (
                        <Typography variant="body2" sx={{ color: "#7dd3fc", mt: 0.5 }}>
                          Explanation: {q.explanation}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleRestart}
                  sx={{
                    backgroundColor: T.colors.accent,
                    color: "#0d0f12",
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: 999,
                    "&:hover": { backgroundColor: T.colors.accentHover },
                  }}
                >
                  Retake Quiz
                </Button>
                <BackButton />
              </Stack>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    lineHeight: 1.6,
                    color: T.colors.textPrimary,
                  }}
                >
                  {currentQuestion?.question}
                </Typography>

                {/* Interactive area */}
                <Box ref={groupRef} tabIndex={0} onKeyDown={onKeyDown} role="group" aria-label="Answer choices">
                  {currentQuestion?.type === "mcq" && currentQuestion.options && (
                    <RadioGroup value={selectedAnswer} sx={{ color: T.colors.textPrimary }}>
                      {currentQuestion.options.map((opt, idx) => {
                        const isCorrect = normalize(opt) === normalize(currentQuestion.answer);
                        const isSelected = selectedAnswer === opt;
                        const showBG = showAnswerResult && isSelected;
                        return (
                          <FormControlLabel
                            key={opt}
                            value={opt}
                            onChange={() => handleSelect(opt)}
                            control={
                              <Radio
                                disableRipple
                                sx={{
                                  color: T.colors.accent,
                                  "&.Mui-checked": {
                                    color: isCorrect ? "#22c55e" : isSelected ? "#ef4444" : T.colors.accent,
                                  },
                                }}
                              />
                            }
                            label={`${idx + 1}. ${opt}`}
                            sx={{
                              mb: 1,
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              cursor: "pointer",
                              backgroundColor: showBG
                                ? isCorrect
                                  ? alpha("#22c55e", 0.15)
                                  : alpha("#ef4444", 0.15)
                                : "transparent",
                              border: `1px solid ${
                                showBG ? (isCorrect ? alpha("#22c55e", 0.4) : alpha("#ef4444", 0.4)) : alpha("#fff", 0.06)
                              }`,
                              transition: "background-color .18s ease, transform .08s ease",
                              "&:hover": { backgroundColor: alpha("#fff", 0.03) },
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  )}

                  {currentQuestion?.type === "true_false" && (
                    <Stack direction="row" gap={1.5} flexWrap="wrap">
                      {["True", "False"].map((val) => {
                        const boolVal = val === "True";
                        const isCorrect = boolVal === currentQuestion.answer;
                        const isSelected = selectedAnswer === boolVal;
                        const showBG = showAnswerResult && isSelected;
                        return (
                          <Button
                            key={val}
                            variant="outlined"
                            onClick={() => handleSelect(boolVal)}
                            sx={{
                              color: T.colors.textPrimary,
                              borderColor: T.colors.borderWeak,
                              backgroundColor: showBG
                                ? isCorrect
                                  ? alpha("#22c55e", 0.15)
                                  : alpha("#ef4444", 0.15)
                                : "transparent",
                              "&:hover": {
                                borderColor: T.colors.accent,
                                backgroundColor: alpha("#fff", 0.04),
                              },
                              fontWeight: 700,
                              px: 3,
                              py: 1,
                              borderRadius: 2,
                              textTransform: "none",
                            }}
                          >
                            {val}
                          </Button>
                        );
                      })}
                    </Stack>
                  )}

                  {currentQuestion &&
                    (currentQuestion.type === "short_answer" || currentQuestion.type === "cloze") && (
                      <Box>
                        <TextField
                          fullWidth
                          placeholder="Type your answer"
                          value={shortAnswerText}
                          onChange={(e) => setShortAnswerText(e.target.value)}
                          sx={{
                            backgroundColor: alpha("#fff", 0.96),
                            borderRadius: 2,
                            mb: 2,
                            input: { color: "#0f172a" },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleShortAnswerSubmit}
                          disabled={!shortAnswerText.trim()}
                          sx={{
                            backgroundColor: T.colors.accent,
                            color: "#0d0f12",
                            "&:hover": { backgroundColor: T.colors.accentHover },
                            fontWeight: 800,
                            textTransform: "none",
                            borderRadius: 999,
                            px: 2.5,
                          }}
                        >
                          Submit Answer
                        </Button>
                      </Box>
                    )}
                </Box>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Panel>
    </Box>
  );
};

export default QuizPage;
