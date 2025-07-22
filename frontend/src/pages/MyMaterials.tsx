import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { db, storage } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import BackButton from "../components/BackButton";
import DifficultyDialog from "../components/DifficultyDialog";

import { extractTextFromPDF } from "../utils/pdfParser";
import { isContentQuizWorthy } from "../utils/isContentQuizWorthy";

interface Material {
  id: string;
  topic: string;
  fileName: string;
  deadline: any;
  uploadedAt: any;
  textContent?: string;
}

const MyMaterials: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizLoadingId, setQuizLoadingId] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [snackOpen, setSnackOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("mixed");

  // Fetch user materials
  useEffect(() => {
    if (!user) return;

    const fetchMaterials = async () => {
      try {
        const q = query(collection(db, "study_materials"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        const fetched: Material[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Material[];

        setMaterials(fetched);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
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
          [material.id]: "This document does not contain quiz-relevant content.",
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

      const parsedQuiz =
        typeof data.quiz === "string" ? JSON.parse(data.quiz) : data.quiz;

      navigate("/quiz", { state: { quizData: parsedQuiz, materialId: material.id } });
    } catch (error: any) {
      console.error("Quiz generation error:", error);
      setErrorMessages((prev) => ({
        ...prev,
        [material.id]: "An unexpected error occurred while generating the quiz.",
      }));
    } finally {
      setQuizLoadingId(null);
      setSnackOpen(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#0f172a", minHeight: "100vh", pb: 6 }}>
      <ResponsiveAppBar />
      <Box sx={{ maxWidth: 900, mx: "auto", pt: 12, px: 3 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            mb: 4,
            textAlign: "center",
          }}
        >
          Your Uploaded Study Materials
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress color="inherit" />
          </Box>
        ) : materials.length === 0 ? (
          <Typography variant="body1" color="gray" textAlign="center" mt={6}>
            No study materials uploaded yet.
          </Typography>
        ) : (
          materials.map((item) => (
            <Paper
              key={item.id}
              elevation={5}
              sx={{
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
                p: 3,
                mb: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {item.topic}
              </Typography>
              <Typography variant="body2" color="#cbd5e1" mb={1}>
                File: {item.fileName}
              </Typography>
              <Typography variant="body2" color="#cbd5e1">
                Deadline: {dayjs(item.deadline?.toDate()).format("DD MMM YYYY, HH:mm")}
              </Typography>
              <Typography variant="body2" color="#cbd5e1" mb={2}>
                Uploaded: {dayjs(item.uploadedAt?.toDate()).format("DD MMM YYYY, HH:mm")}
              </Typography>

              {item.textContent && (
                <>
                  <Divider sx={{ my: 2, borderColor: "#334155" }} />
                  <Typography variant="subtitle2" color="#94a3b8" mb={1}>
                    Preview Extract:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#0f172a",
                      borderRadius: 2,
                      p: 2,
                      color: "#e2e8f0",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.textContent.slice(0, 300)}...
                  </Typography>
                </>
              )}

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => openDifficultyDialog(item)}
                  disabled={quizLoadingId === item.id}
                  sx={{
                    backgroundColor: "#3b82f6",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#2563eb" },
                  }}
                >
                  {quizLoadingId === item.id ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Generate Quiz"
                  )}
                </Button>
              </Box>

              {errorMessages[item.id] && (
                <Box
                  sx={{
                    mt: 2,
                    backgroundColor: "#0f172a",
                    borderRadius: 2,
                    p: 2,
                    color: "#f87171",
                    fontSize: "0.9rem",
                    border: "1px solid #dc2626",
                  }}
                >
                  {errorMessages[item.id]}
                </Box>
              )}
            </Paper>
          ))
        )}
      </Box>

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

      <DifficultyDialog
        open={dialogOpen}
        difficulty={selectedDifficulty}
        onSelect={(val) => setSelectedDifficulty(val)}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleGenerateQuiz}
      />

      <BackButton />
    </Box>
  );
};

export default MyMaterials;
