// src/components/EmotionLogger.tsx
import React, { useEffect, useMemo, useState } from "react";
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
  Stack,
  Divider,
  Fade,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BoltRounded from "@mui/icons-material/BoltRounded";
import { TOKENS as T } from "../theme/tokens";
import { logUserEmotion } from "../firebase/logUserEmotion";
import { useAuth } from "../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  materialId?: string;
  onLogged?: (emotion: string) => void;
  defaultEmotion?: string;
}

const EMOTIONS = [
  "Confident",
  "Frustrated",
  "Tired",
  "Motivated",
  "Overwhelmed",
  "Focused",
] as const;

const MAX_REASON = 240;

const EmotionLogger: React.FC<Props> = ({
  open,
  onClose,
  materialId,
  onLogged,
  defaultEmotion,
}) => {
  const { user } = useAuth();

  const [emotion, setEmotion] = useState<string>("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  // tokens
  const panel = T.colors.panel;
  const border = T.colors.borderWeak;
  const textPri = T.colors.textPrimary;
  const textMut = T.colors.textMuted;
  const accent = T.colors.accent;

  // ensure a valid default
  const safeDefault = useMemo(() => {
    const d = (defaultEmotion || "").toLowerCase();
    return EMOTIONS.map((e) => e.toLowerCase()).includes(d as any) ? d : "";
  }, [defaultEmotion]);

  useEffect(() => {
    setEmotion(safeDefault);
    setReason("");
    setFeedback("");
    setError("");
  }, [open, safeDefault]);

  const handleSubmit = async () => {
    if (!emotion || !user) return;
    setSubmitting(true);
    setError("");

    try {
      await logUserEmotion({
        uid: user.uid,
        emotion,
        reason: reason.trim(),
        materialId,
      });

      // Optional: lightweight guidance from your API
      const res = await fetch("/api/emotion-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, reason }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.feedback) setFeedback(data.feedback);
      }

      onLogged?.(emotion);
    } catch (e) {
      console.error("Emotion log or feedback failed:", e);
      setError("Couldn’t save right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmotion("");
    setReason("");
    setFeedback("");
    setError("");
    onClose();
  };

  const reasonChars = reason.length;
  const canSubmit = Boolean(emotion) && !submitting;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: panel,
          color: textPri,
          borderRadius: 3,
          border: `1px solid ${border}`,
          boxShadow: T.shadows.lg,
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 800,
          letterSpacing: 0.2,
          color: textPri,
          pb: 1.25,
        }}
      >
        <BoltRounded sx={{ color: accent }} />
        How do you feel about your work at the moment?
        <span
          aria-hidden
          style={{
            display: "inline-block",
            height: 2,
            width: 120,
            marginLeft: 12,
            borderRadius: 999,
            background: `linear-gradient(90deg, transparent, ${alpha(
              accent,
              0.85
            )}, transparent)`,
            filter: "drop-shadow(0 0 4px rgba(46,204,113,.35))",
          }}
        />
      </DialogTitle>

      <Divider sx={{ borderColor: alpha("#fff", 0.08), mb: 1.5 }} />

      <DialogContent sx={{ pt: 0 }}>
        {/* Feedback state */}
        {feedback ? (
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontSize: "1rem",
                color: alpha("#a5f3fc", 0.95),
                lineHeight: 1.6,
              }}
            >
              {feedback}
            </Typography>
            <Button
              fullWidth
              onClick={handleClose}
              variant="contained"
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 999,
                backgroundColor: accent,
                color: "#0d0f12",
                "&:hover": { backgroundColor: T.colors.accentHover },
              }}
            >
              Close
            </Button>
          </Box>
        ) : (
          <>
            {/* Emotion choices */}
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ mb: 2.5 }}
              role="group"
              aria-label="Select an emotion"
            >
              {EMOTIONS.map((opt) => {
                const key = opt.toLowerCase();
                const selected = emotion === key;
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    onClick={() => setEmotion(key)}
                    aria-pressed={selected}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "999px",
                      px: 2,
                      py: 0.6,
                      fontWeight: 600,
                      color: selected ? "#0d0f12" : textPri,
                      backgroundColor: selected
                        ? accent
                        : alpha("#fff", 0.06),
                      border: `1px solid ${
                        selected ? alpha(accent, 0.5) : alpha("#fff", 0.12)
                      }`,
                      boxShadow: selected ? `0 0 0 3px ${alpha(accent, 0.15)}` : "none",
                      transition:
                        "background-color .15s ease, box-shadow .15s ease, transform .1s ease",
                      "&:hover": {
                        backgroundColor: selected ? T.colors.accentHover : alpha("#fff", 0.1),
                        transform: "translateY(-1px)",
                      },
                    }}
                  />
                );
              })}
            </Stack>

            {/* Reason input */}
            <Typography variant="body2" sx={{ mb: 0.75, color: textMut }}>
              Optional: Share a quick reason
            </Typography>

            <TextField
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              value={reason}
              inputProps={{ maxLength: MAX_REASON }}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g., I feel stuck over Economics"
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: alpha("#fff", 0.02),
                  color: textPri,
                  borderRadius: 2,
                  "& fieldset": { borderColor: border },
                  "&:hover fieldset": { borderColor: alpha("#fff", 0.35) },
                  "&.Mui-focused fieldset": { borderColor: accent },
                },
                "& .MuiInputBase-input::placeholder": { color: textMut, opacity: 1 },
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 0.5 }}
            >
              <Typography variant="caption" sx={{ color: textMut }}>
                {emotion
                  ? "Thanks — this helps tailor your guidance."
                  : "Pick the option that best matches how you feel."}
              </Typography>
              <Typography variant="caption" sx={{ color: textMut }}>
                {reasonChars}/{MAX_REASON}
              </Typography>
            </Stack>

            {!!error && (
              <Typography
                role="alert"
                sx={{ mt: 1, color: "#ffb3c1", fontSize: 13 }}
              >
                {error}
              </Typography>
            )}
          </>
        )}
      </DialogContent>

      {!feedback && (
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: textMut,
              borderRadius: 999,
              px: 2.2,
              "&:hover": { bgcolor: alpha("#fff", 0.05) },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
            endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{
              textTransform: "none",
              fontWeight: 800,
              borderRadius: 999,
              px: 2.8,
              minWidth: 140,
              backgroundColor: canSubmit ? accent : alpha(accent, 0.35),
              color: "#0d0f12",
              boxShadow: canSubmit ? `0 0 0 0 ${alpha(accent, 0)}` : "none",
              transition: "box-shadow .18s ease, transform .12s ease",
              "&:hover": canSubmit
                ? {
                    backgroundColor: T.colors.accentHover,
                    transform: "translateY(-1px)",
                    boxShadow: `0 0 0 3px ${alpha(accent, 0.22)}`,
                  }
                : undefined,
            }}
          >
            {submitting ? "Submitting" : "Submit"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EmotionLogger;
