// src/pages/Upload.tsx
import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { extractTextFromPDF } from "../utils/pdfParser";
import { isContentQuizWorthy } from "../utils/isContentQuizWorthy";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import BackButton from "../components/BackButton";
import { postCustomNotes } from "../routes/postCustomNotes";
import { TOKENS as T } from "../theme/tokens";
import Footer from "../components/Footer";

const MAX_FILE_SIZE_MB = 5;
const RADIUS = "24px";

const Upload: React.FC = () => {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const pickFile = () => inputRef.current?.click();

  const validate = () => {
    if (!user) return "You must be signed in.";
    if (!topic.trim()) return "Please enter a topic.";
    if (!deadline.trim()) return "Please set a deadline.";
    if (!file) return "Please choose a PDF file.";
    if (file.type !== "application/pdf") return "Only PDF files are allowed.";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return `File too large. Max allowed is ${MAX_FILE_SIZE_MB} MB.`;
    return "";
  };

  const handleSelect = (selected: File | null) => {
    resetMessages();
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max allowed is ${MAX_FILE_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0] ?? null;
    handleSelect(f);
  }, []);

  const handleUpload = async () => {
    resetMessages();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    if (!file || !user) return;

    setLoading(true);
    try {
      const extractedText = await extractTextFromPDF(file);

      const { isQuizWorthy, confidenceScore, reasons } =
        isContentQuizWorthy(extractedText);

      if (!isQuizWorthy) {
        setError(
          `This file doesn’t look quiz-worthy yet.\nReasons: ${reasons.join(
            " "
          )}\nConfidence: ${confidenceScore}`
        );
        setLoading(false);
        return;
      }

      const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);

      const docRef = await addDoc(collection(db, "study_materials"), {
        uid: user.uid,
        topic: topic.trim(),
        fileName: file.name,
        deadline: Timestamp.fromDate(new Date(deadline)),
        uploadedAt: Timestamp.now(),
      });

      try {
        await postCustomNotes({
          uid: user.uid,
          materialId: docRef.id,
          parsedText: extractedText,
        });
      } catch (err) {
        console.warn("Note generation failed:", err);
      }

      setSuccess("Upload successful! Notes are being generated.");
      setFile(null);
      setTopic("");
      setDeadline("");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(900px 600px at 20% 0%, rgba(46,204,113,0.06) 0%, transparent 70%),
          radial-gradient(800px 500px at 80% 15%, rgba(45,156,219,0.05) 0%, transparent 65%),
          linear-gradient(to bottom right, #0f2027, #18232f)
        `,
        color: T.colors.textPrimary,
      }}
    >
      <ResponsiveAppBar />

      <Container maxWidth="lg" sx={{ pt: { xs: 11, md: 13 }, pb: 9 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <BackButton />
        </Stack>

        <Stack spacing={1.25} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight={800} letterSpacing={-0.2} sx={{ color: T.colors.textPrimary }}>
            Upload study materials
          </Typography>
          <Typography variant="body1" sx={{ color: T.colors.textMuted, maxWidth: 760 }}>
            PDF handouts, lecture slides or notes — you upload, we generate quizzes and summaries.
          </Typography>
          <Box
            sx={{
              mt: 1,
              width: 160,
              height: 2,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${alpha(
                T.colors.accent,
                0.7
              )}, transparent)`,
            }}
          />
        </Stack>

        {/* Content */}
        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            alignItems: "start",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(520px, 720px) 380px",
            },
          }}
        >
          {/* Upload card — centered column */}
          <Box sx={{ order: 1, width: "100%", maxWidth: 720, mx: "auto" }}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: T.colors.panel,
                border: `1px solid ${T.colors.borderWeak}`,
                borderRadius: RADIUS,
                boxShadow: T.shadows.md,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* loader overlay */}
              <Collapse in={loading} unmountOnExit>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: alpha("#0b0e13", 0.55),
                    backdropFilter: "blur(2px)",
                    display: "grid",
                    placeItems: "center",
                    zIndex: 2,
                  }}
                >
                  <Stack spacing={1.5} alignItems="center">
                    <LinearProgress
                      sx={{
                        width: 220,
                        height: 8,
                        borderRadius: 8,
                        backgroundColor: alpha("#fff", 0.08),
                        "& .MuiLinearProgress-bar": { backgroundColor: T.colors.accent },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: alpha("#fff", 0.9) }}>
                      Uploading & generating notes…
                    </Typography>
                  </Stack>
                </Box>
              </Collapse>

              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.25}>
                  {/* Inputs */}
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Algorithms — Divide & Conquer"
                      InputLabelProps={{ sx: { color: T.colors.textMuted } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: alpha("#fff", 0.02),
                          borderRadius: "14px",
                          color: T.colors.textPrimary, // text color
                          "& fieldset": { borderColor: T.colors.borderWeak },
                          "&:hover fieldset": { borderColor: alpha("#fff", 0.35) },
                          "&.Mui-focused fieldset": { borderColor: T.colors.accent },
                        },
                        "& .MuiInputBase-input": {
                          color: T.colors.textPrimary,
                          "::placeholder": { color: T.colors.textMuted, opacity: 1 },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Deadline"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      InputLabelProps={{ shrink: true, sx: { color: T.colors.textMuted } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: alpha("#fff", 0.02),
                          borderRadius: "14px",
                          color: T.colors.textPrimary, // text color
                          "& fieldset": { borderColor: T.colors.borderWeak },
                          "&:hover fieldset": { borderColor: alpha("#fff", 0.35) },
                          "&.Mui-focused fieldset": { borderColor: T.colors.accent },
                        },
                        "& .MuiInputBase-input": { color: T.colors.textPrimary },
                      }}
                    />
                  </Stack>

                  {/* Dropzone */}
                  <Box
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      onDrop(e);
                    }}
                    onClick={pickFile}
                    role="button"
                    aria-label="Upload PDF"
                    tabIndex={0}
                    sx={{
                      minHeight: 160,
                      borderRadius: "16px",
                      border: `1px dashed ${alpha("#fff", 0.18)}`,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))",
                      display: "grid",
                      placeItems: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      transition:
                        "border-color .18s ease, background-color .18s ease, transform .12s ease",
                      "&:hover": {
                        backgroundColor: alpha(T.colors.accent, 0.08),
                        borderColor: alpha(T.colors.accent, 0.45),
                        transform: "translateY(-1px)",
                      },
                      "&:focus-visible": {
                        outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                        outlineOffset: 2,
                      },
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: alpha(T.colors.accent, 0.12),
                          border: `1px solid ${alpha(T.colors.accent, 0.35)}`,
                        }}
                      >
                        <CloudUploadIcon sx={{ color: T.colors.accent }} />
                      </Box>
                      <Typography fontWeight={800} sx={{ color: T.colors.textPrimary }}>
                        Drag & drop PDF here
                      </Typography>
                      <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                        or click to choose — max {MAX_FILE_SIZE_MB} MB
                      </Typography>
                      <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
                        hidden
                      />
                    </Stack>
                  </Box>

                  {/* File pill */}
                  {file && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        p: 1.2,
                        borderRadius: "12px",
                        border: `1px solid ${alpha("#fff", 0.12)}`,
                        backgroundColor: alpha("#fff", 0.03),
                      }}
                    >
                      <PictureAsPdfIcon sx={{ color: "#4B7BE5" }} />
                      <Typography sx={{ flexGrow: 1, color: T.colors.textPrimary }}>
                        {file.name}
                      </Typography>
                      <Chip
                        label={`${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(T.colors.accent, 0.12),
                          border: `1px solid ${alpha(T.colors.accent, 0.45)}`,
                          color: T.colors.textPrimary,
                        }}
                      />
                      <Button
                        onClick={() => handleSelect(null)}
                        startIcon={<DeleteOutlineIcon />}
                        sx={{
                          textTransform: "none",
                          color: T.colors.textPrimary, // ensure readable
                          "&:hover": { backgroundColor: alpha("#fff", 0.06) },
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  )}

                  {/* Messages */}
                  <Collapse in={!!error} unmountOnExit>
                    <Alert
                      severity="error"
                      variant="outlined"
                      sx={{
                        borderColor: alpha("#ff1744", 0.35),
                        color: "#ffd6d6", // high-contrast error text
                        backgroundColor: alpha("#ff1744", 0.08),
                      }}
                    >
                      {error.split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </Alert>
                  </Collapse>

                  <Collapse in={!!success} unmountOnExit>
                    <Alert
                      icon={<CheckCircleIcon fontSize="inherit" />}
                      severity="success"
                      variant="outlined"
                      sx={{
                        borderColor: alpha("#4ade80", 0.35),
                        color: "#dcffe6", // high-contrast success text
                        backgroundColor: alpha("#22c55e", 0.08),
                      }}
                    >
                      {success}
                    </Alert>
                  </Collapse>

                  <Button
                    onClick={handleUpload}
                    disabled={loading}
                    variant="contained"
                    size="large"
                    sx={{
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                      backgroundColor: T.colors.accent,
                      color: "#0d0f12",
                      fontWeight: 800,
                      textTransform: "none",
                      px: 3.5,
                      py: 1.2,
                      borderRadius: "999px",
                      "&:hover": { backgroundColor: T.colors.accentHover },
                      "&.Mui-disabled": {
                        backgroundColor: alpha(T.colors.accent, 0.35),
                        color: alpha("#0d0f12", 0.6),
                      },
                    }}
                  >
                    Upload
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Explainer / side panel — right on md+, below on mobile */}
          <Box sx={{ order: { xs: 2, md: 1 } }}>
            <Card
              sx={{
                backgroundColor: T.colors.panel,
                border: `1px solid ${T.colors.borderWeak}`,
                borderRadius: RADIUS,
                boxShadow: T.shadows.md,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InfoOutlinedIcon sx={{ color: T.colors.accent }} />
                    <Typography fontWeight={800} sx={{ color: T.colors.textPrimary }}>
                      What happens next?
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderColor: alpha("#fff", 0.08) }} />

                  <Stack spacing={1.1} sx={{ lineHeight: 1.6 }}>
                    <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                      • We securely store your file and extract text locally to prepare it for AI
                      processing.
                    </Typography>
                    <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                      • A quick suitability check ensures content is meaningful for quizzes.
                    </Typography>
                    <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                      • Notes and question candidates are generated from <b>your</b> material only.
                    </Typography>
                    <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                      • You'll find the results in <b>Notes</b>; quizzes appear under your material.
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderColor: alpha("#fff", 0.08), my: 1.25 }} />

                  <Stack spacing={0.5}>
                    <Typography variant="overline" sx={{ color: T.colors.textMuted }}>
                      Privacy
                    </Typography>
                    <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                      We don't keep raw parsed text longer than needed for generation.
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Upload;
