// src/pages/MyMaterials.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemText,
  Grid,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuizIcon from "@mui/icons-material/Quiz";
import EventIcon from "@mui/icons-material/Event";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { collection, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import { db, storage } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import BackButton from "../components/BackButton";
import DifficultyDialog from "../components/DifficultyDialog";
import { extractTextFromPDF } from "../utils/pdfParser";
import { isContentQuizWorthy } from "../utils/isContentQuizWorthy";
import { TOKENS as T } from "../theme/tokens";

/* ----------------------------- Types -------------------------------- */
interface Material {
  id: string;
  topic: string;
  fileName: string;
  deadline: any;
  uploadedAt: any;
  textContent?: string;
}
interface CustomNotes {
  summary: string;
  keyConcepts: string[];
  visualSuggestions: string[];
  notableInsights: string[];
}

/* --------------------------- Small bits ------------------------------ */
const Pill: React.FC<React.PropsWithChildren<{ icon?: React.ReactNode }>> = ({
  icon,
  children,
}) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      px: 1.25,
      py: 0.5,
      borderRadius: "999px",
      border: `1px solid ${alpha("#fff", 0.12)}`,
      bgcolor: alpha("#fff", 0.04),
      color: T.colors.textPrimary,
    }}
  >
    {icon}
    <Typography variant="body2" sx={{ lineHeight: 1 }}>
      {children}
    </Typography>
  </Stack>
);

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, children, defaultExpanded = true }) => (
  <Accordion
    defaultExpanded={defaultExpanded}
    disableGutters
    sx={{
      bgcolor: alpha("#fff", 0.03),
      border: `1px solid ${alpha("#fff", 0.08)}`,
      borderRadius: `${T.radius.md} !important`,
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: T.colors.textMuted }} />}
      sx={{
        px: 2,
        "& .MuiAccordionSummary-content": { my: 0.5 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, color: T.colors.textPrimary }}
      >
        {title}
      </Typography>
    </AccordionSummary>
    <Divider sx={{ borderColor: alpha("#fff", 0.06) }} />
    <AccordionDetails sx={{ px: 2.25, py: 2 }}>{children}</AccordionDetails>
  </Accordion>
);

/* ------------------------------ Page -------------------------------- */
const MyMaterials: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [customNotesMap, setCustomNotesMap] = useState<Record<string, CustomNotes>>({});
  const [loading, setLoading] = useState(true);
  const [quizLoadingId, setQuizLoadingId] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("mixed");

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const q = query(collection(db, "study_materials"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        const fetched: Material[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Material, "id">),
        }));
        setMaterials(fetched);

        const notesSnapshot = await getDocs(
          query(collection(db, "custom_notes"), where("uid", "==", user.uid))
        );
        const notesMap: Record<string, CustomNotes> = {};
        notesSnapshot.forEach((doc) => {
          const { notes } = doc.data() as any;
          notesMap[doc.id] = notes;
        });
        setCustomNotesMap(notesMap);
      } catch (e) {
        console.error("Failed to fetch materials/notes", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const openDifficultyDialog = (material: Material) => {
    setSelectedMaterial(material);
    setSelectedDifficulty("mixed");
    setDialogOpen(true);
  };

  const handleGenerateQuiz = async () => {
    if (!user || !selectedMaterial) return;

    const material = selectedMaterial;
    setDialogOpen(false);
    setQuizLoadingId(material.id);
    setErrorMessages((prev) => ({ ...prev, [material.id]: "" }));

    try {
      const fileRef = ref(storage, `uploads/${user.uid}/${material.fileName}`);
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], material.fileName, { type: blob.type });

      const text = await extractTextFromPDF(file);
      if (!isContentQuizWorthy(text)) {
        setErrorMessages((prev) => ({
          ...prev,
          [material.id]: "This document doesn’t contain quiz-relevant content.",
        }));
        return;
      }

      const quizRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, difficulty: selectedDifficulty }),
      });

      const data = await quizRes.json();
      if (!quizRes.ok) throw new Error(data.message || "Quiz generation failed.");

      const parsedQuiz = typeof data.quiz === "string" ? JSON.parse(data.quiz) : data.quiz;
      navigate("/quiz", { state: { quizData: parsedQuiz, materialId: material.id } });
    } catch (err) {
      console.error("Quiz generation error:", err);
      setErrorMessages((prev) => ({
        ...prev,
        [material.id]: "An unexpected error occurred while generating the quiz.",
      }));
    } finally {
      setQuizLoadingId(null);
      setSnackOpen(true);
    }
  };

  /* ----------------------------- Render ------------------------------ */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(900px 600px at 20% 0%, rgba(46,204,113,0.06) 0%, transparent 70%),
          radial-gradient(800px 500px at 80% 15%, rgba(45,156,219,0.05) 0%, transparent 65%),
          linear-gradient(to bottom right, #0f2027, #18232f)
        `,
      }}
    >
      <ResponsiveAppBar />

      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 14 }, pb: 10 }}>
        {/* Back & Title */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <BackButton />
        </Stack>

        <Stack spacing={1.25} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: T.colors.textPrimary, fontWeight: 800 }}>
            Your Study Materials
          </Typography>
          <Box
            sx={{
              mt: 0.5,
              width: 180,
              height: 2,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${alpha(
                T.colors.accent,
                0.7
              )}, transparent)`,
            }}
          />
        </Stack>

        {/* States */}
        {loading ? (
          <Box sx={{ display: "grid", justifyContent: "center", py: 12 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : materials.length === 0 ? (
          <Card
            sx={{
              mx: "auto",
              maxWidth: 760,
              backgroundColor: T.colors.panel,
              border: `1px solid ${T.colors.borderWeak}`,
              borderRadius: T.radius.lg,
              boxShadow: T.shadows.md,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: T.colors.textPrimary, fontWeight: 700, mb: 1 }}>
                Nothing here yet
              </Typography>
              <Typography variant="body2" sx={{ color: T.colors.textMuted, mb: 2 }}>
                Upload a PDF to generate custom notes and quizzes.
              </Typography>
              <Button
                href="/tempostudy"
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  backgroundColor: T.colors.accent,
                  color: "#0d0f12",
                  "&:hover": { backgroundColor: T.colors.accentHover },
                }}
              >
                Go to Uploads
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3.5}>
            {materials.map((item, index) => {
              const notes = customNotesMap[item.id];
              const isBusy = quizLoadingId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
                >
                  <Card
                    sx={{
                      backgroundColor: T.colors.panel,
                      border: `1px solid ${T.colors.borderWeak}`,
                      borderRadius: T.radius.lg,
                      boxShadow: T.shadows.md,
                      overflow: "hidden",
                      transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: T.shadows.lg,
                        borderColor: alpha(T.colors.accent, 0.35),
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      {/* Header row */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        gap={1.25}
                        sx={{ mb: 1.25 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: T.colors.textPrimary, fontWeight: 800, lineHeight: 1.2 }}
                        >
                          {item.topic}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Generate an AI quiz from this material">
                            <span>
                              <Button
                                onClick={() => openDifficultyDialog(item)}
                                disabled={isBusy}
                                startIcon={<QuizIcon />}
                                variant="contained"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 800,
                                  px: 2.25,
                                  backgroundColor: T.colors.accent,
                                  color: "#0d0f12",
                                  "&:hover": { backgroundColor: T.colors.accentHover },
                                }}
                              >
                                {isBusy ? <CircularProgress size={18} color="inherit" /> : "Generate Quiz"}
                              </Button>
                            </span>
                          </Tooltip>
                        </Stack>
                      </Stack>

                      <Divider sx={{ borderColor: alpha("#fff", 0.08), mb: 2 }} />

                      {/* Content grid */}
                      <Grid container spacing={3}>
                        {/* Meta sidebar */}
                        <Grid item xs={12} md={4}>
                          <Stack spacing={1.25}>
                            <Pill icon={<DescriptionIcon fontSize="small" />}>{item.fileName}</Pill>
                            <Pill icon={<EventIcon fontSize="small" />}>
                              Deadline:&nbsp;
                              <strong>
                                {item.deadline?.toDate
                                  ? dayjs(item.deadline.toDate()).format("DD MMM YYYY, HH:mm")
                                  : "-"}
                              </strong>
                            </Pill>
                            <Pill icon={<UploadFileIcon fontSize="small" />}>
                              Uploaded:&nbsp;
                              {item.uploadedAt?.toDate
                                ? dayjs(item.uploadedAt.toDate()).format("DD MMM YYYY, HH:mm")
                                : "-"}
                            </Pill>
                          </Stack>

                          {/* Inline error for this card */}
                          {errorMessages[item.id] && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 1.25,
                                borderRadius: T.radius.md,
                                border: `1px solid ${alpha("#ff1744", 0.35)}`,
                                bgcolor: alpha("#ff1744", 0.06),
                                color: "#ffb3c1",
                              }}
                            >
                              {errorMessages[item.id]}
                            </Box>
                          )}
                        </Grid>

                        {/* Notes column */}
                        <Grid item xs={12} md={8}>
                          {notes ? (
                            <Stack spacing={1.5}>
                              <Section title="Custom Notes">
                                <Typography variant="body2" sx={{ color: T.colors.textPrimary, lineHeight: 1.8 }}>
                                  <strong>Summary: </strong>
                                  {notes.summary}
                                </Typography>
                              </Section>

                              {notes.keyConcepts?.length > 0 && (
                                <Section title="Key Concepts" defaultExpanded={false}>
                                  <List dense disablePadding sx={{ ml: 1 }}>
                                    {notes.keyConcepts.map((k, i) => (
                                      <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                                        <ListItemText
                                          primaryTypographyProps={{
                                            variant: "body2",
                                            sx: { color: T.colors.textPrimary },
                                          }}
                                          primary={`• ${k}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Section>
                              )}

                              {notes.visualSuggestions?.length > 0 && (
                                <Section title="Visual Suggestions" defaultExpanded={false}>
                                  <List dense disablePadding sx={{ ml: 1 }}>
                                    {notes.visualSuggestions.map((v, i) => (
                                      <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                                        <ListItemText
                                          primaryTypographyProps={{
                                            variant: "body2",
                                            sx: { color: T.colors.textPrimary },
                                          }}
                                          primary={`• ${v}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Section>
                              )}

                              {notes.notableInsights?.length > 0 && (
                                <Section title="Notable Insights" defaultExpanded={false}>
                                  <List dense disablePadding sx={{ ml: 1 }}>
                                    {notes.notableInsights.map((ins, i) => (
                                      <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                                        <ListItemText
                                          primaryTypographyProps={{
                                            variant: "body2",
                                            sx: { color: T.colors.textPrimary },
                                          }}
                                          primary={`• ${ins}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Section>
                              )}
                            </Stack>
                          ) : (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{
                                p: 2,
                                borderRadius: T.radius.md,
                                border: `1px dashed ${alpha("#fff", 0.12)}`,
                                bgcolor: alpha("#fff", 0.02),
                              }}
                            >
                              <InfoOutlinedIcon sx={{ color: T.colors.accent }} />
                              <Typography variant="body2" sx={{ color: T.colors.textMuted }}>
                                Notes are not generated for this material yet. Check back soon.
                              </Typography>
                            </Stack>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            {quizLoadingId ? "Generating quiz..." : "Quiz ready or error handled."}
          </Alert>
        </Snackbar>

        {/* Difficulty dialog */}
        <DifficultyDialog
          open={dialogOpen}
          difficulty={selectedDifficulty}
          onSelect={(val) => setSelectedDifficulty(val)}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleGenerateQuiz}
        />
      </Container>
    </Box>
  );
};

export default MyMaterials;
