import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { extractTextFromPDF } from "../utils/pdfParser";
import { isContentQuizWorthy } from "../utils/isContentQuizWorthy";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import BackButton from "../components/BackButton";
import { postCustomNotes } from "../routes/postCustomNotes";

const MAX_FILE_SIZE_MB = 5;

const Upload: React.FC = () => {
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setMessage("");

    if (!file || !user || !topic.trim() || !deadline.trim()) {
      setMessage("Please fill in all fields and select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setMessage(`File too large. Max allowed is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    setLoading(true);

    try {
      // 1. Extract text from PDF
      const extractedText = await extractTextFromPDF(file);

      // 2. Check quiz-worthiness
      const { isQuizWorthy, confidenceScore, reasons } =
        isContentQuizWorthy(extractedText);

      if (!isQuizWorthy) {
        setMessage(
          `This file is not quiz-worthy.\nReasons: ${reasons.join(" ")}\nConfidence: ${confidenceScore}`
        );
        setLoading(false);
        return;
      }

      // 3. Upload file to Firebase Storage
      const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);

      // 4. Save study material metadata to Firestore
      const docRef = await addDoc(collection(db, "study_materials"), {
        uid: user.uid,
        topic: topic.trim(),
        fileName: file.name,
        deadline: Timestamp.fromDate(new Date(deadline)),
        uploadedAt: Timestamp.now(),
      });

      // 5. Trigger custom notes generation
      try {
        await postCustomNotes({
          uid: user.uid,
          materialId: docRef.id,
          parsedText: extractedText,
        });
      } catch (err) {
        console.warn("Note generation failed:", err);
      }

      setMessage("Upload successful! Notes are being generated.");
      setFile(null);
      setTopic("");
      setDeadline("");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        py: 10,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResponsiveAppBar />
      <BackButton />
      <Paper
        elevation={8}
        sx={{
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          borderRadius: 4,
          p: 4,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 600,
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          Upload Study Material
        </Typography>

        <TextField
          fullWidth
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          sx={{ mb: 3 }}
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{
            sx: {
              color: "#fff",
              "& input": { color: "#fff" },
            },
          }}
        />

        <TextField
          fullWidth
          type="datetime-local"
          label="Deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true, style: { color: "#ccc" } }}
          InputProps={{
            sx: {
              color: "#fff",
              "& input": { color: "#fff" },
              "& .MuiSvgIcon-root": { color: "#fff" },
            },
          }}
        />

        <Box sx={{ mb: 3 }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              setFile(selected);
              if (
                selected &&
                selected.size > MAX_FILE_SIZE_MB * 1024 * 1024
              ) {
                setMessage(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
              } else {
                setMessage("");
              }
            }}
            style={{
              color: "#fff",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              padding: "8px",
              borderRadius: "6px",
              width: "100%",
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
          sx={{
            backgroundColor: "#3b82f6",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
            mb: 2,
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Upload"}
        </Button>

        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: message.includes("successful") ? "#4ade80" : "#f87171",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Upload;
