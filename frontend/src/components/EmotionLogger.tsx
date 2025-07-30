import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { logUserEmotion } from "../firebase/logUserEmotion";
import { useAuth } from "../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  materialId?: string;
  onLogged?: (emotion: string) => void;
  defaultEmotion?: string; // New prop to pre-fill emotion for homepage
}

const emotionOptions = [
  "Confident",
  "Frustrated",
  "Tired",
  "Motivated",
  "Overwhelmed",
  "Focused",
];

const EmotionLogger: React.FC<Props> = ({
  open,
  onClose,
  materialId,
  onLogged,
  defaultEmotion,
}) => {
  const { user } = useAuth();
  const [emotion, setEmotion] = useState(defaultEmotion?.toLowerCase() || "");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (defaultEmotion) {
      setEmotion(defaultEmotion.toLowerCase());
    }
  }, [defaultEmotion, open]);

  const handleSubmit = async () => {
    if (!emotion || !user) return;
    setSubmitting(true);

    try {
      await logUserEmotion({
        uid: user.uid,
        emotion,
        reason,
        materialId,
      });

      const res = await fetch("/api/emotion-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, reason }),
      });

      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      }

      if (onLogged) onLogged(emotion);
    } catch (err) {
      console.error("Emotion log or feedback failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmotion("");
    setReason("");
    setFeedback("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          borderRadius: 4,
          p: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "#f8fafc",
          mb: 1,
        }}
      >
        How do you feel about your work at the moment?
      </DialogTitle>

      <DialogContent>
        {feedback ? (
          <Box>
            <Typography sx={{ mb: 2, fontSize: "1rem", color: "#a5f3fc" }}>
              {feedback}
            </Typography>
            <Button
              fullWidth
              onClick={handleClose}
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {emotionOptions.map((opt) => {
                const selected = emotion === opt.toLowerCase();
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    onClick={() => setEmotion(opt.toLowerCase())}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: selected ? "#3b82f6" : "#334155",
                      color: selected ? "#fff" : "#f1f5f9",
                      fontWeight: 500,
                      borderRadius: "1.5rem",
                      px: 2,
                      py: 0.5,
                      "&:hover": { backgroundColor: "#2563eb" },
                      transition: "0.3s",
                    }}
                  />
                );
              })}
            </Box>

            <Typography variant="body2" sx={{ mb: 1, color: "#cbd5e1" }}>
              Optional: Share a quick reason
            </Typography>

            <TextField
              multiline
              rows={3}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., I feel stuck over Economics"
              sx={{
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                mb: 2,
                input: { color: "#0f172a" },
                textarea: { color: "#0f172a" },
              }}
            />
          </>
        )}
      </DialogContent>

      {!feedback && (
        <DialogActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button onClick={handleClose} sx={{ color: "#94a3b8" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!emotion || submitting}
            sx={{
              backgroundColor: "#3b82f6",
              "&:hover": { backgroundColor: "#2563eb" },
              textTransform: "none",
              fontWeight: 600,
              minWidth: 140,
            }}
            endIcon={submitting && <CircularProgress size={18} color="inherit" />}
          >
            {submitting ? "Submitting" : "Submit"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EmotionLogger;
