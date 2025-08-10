import React, { useMemo, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Typography,
  Divider,
  Fade,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ShuffleRounded from "@mui/icons-material/ShuffleRounded";
import SpaRounded from "@mui/icons-material/SpaRounded";
import SpeedRounded from "@mui/icons-material/SpeedRounded";
import WhatshotRounded from "@mui/icons-material/WhatshotRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import { TOKENS as T } from "../theme/tokens";

interface DifficultyDialogProps {
  open: boolean;
  difficulty: string;
  onClose: () => void;
  onSelect: (difficulty: string) => void;
  onConfirm: () => void;
}

const DIFF_META: Record<
  "mixed" | "easy" | "medium" | "hard",
  { label: string; desc: string; Icon: React.ElementType }
> = {
  mixed: { label: "Mixed", desc: "Balanced selection across all levels.", Icon: ShuffleRounded },
  easy: { label: "Easy", desc: "Warm-up questions to build confidence.", Icon: SpaRounded },
  medium: { label: "Medium", desc: "Solid practice at a steady pace.", Icon: SpeedRounded },
  hard: { label: "Hard", desc: "Challenging items for mastery.", Icon: WhatshotRounded },
};

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({
  open,
  difficulty,
  onClose,
  onSelect,
  onConfirm,
}) => {
  const selectRef = useRef<HTMLDivElement | null>(null);

  const value = useMemo(() => {
    const v = (difficulty || "mixed").toLowerCase() as any;
    return (["mixed", "easy", "medium", "hard"] as const).includes(v) ? v : "mixed";
  }, [difficulty]);

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Enter") { e.preventDefault(); onConfirm(); }
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  const panel = T.colors.panel;
  const border = T.colors.borderWeak;
  const textPri = T.colors.textPrimary;
  const textMut = T.colors.textMuted;
  const accent = T.colors.accent;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          background: `linear-gradient(180deg, ${alpha("#fff", 0.02)}, ${alpha("#fff", 0.015)})`,
          bgcolor: panel,
          color: textPri,
          borderRadius: 3,
          border: `1px solid ${border}`,
          boxShadow: T.shadows.lg,
          px: 2,
          py: 1.5,
          minWidth: { xs: 360, sm: 420 },
          outline: "none",
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
        Select Quiz Difficulty
        <BoxGlow />
      </DialogTitle>

      <Divider sx={{ borderColor: alpha("#fff", 0.08), mb: 1.25 }} />

      {/* Add a bit of top padding so the floating label clears the divider */}
      <DialogContent sx={{ pt: 0.75 }}>
        {/* Add mt so the label never collides with the divider (fixes cropping) */}
        <FormControl fullWidth size="medium" variant="outlined" sx={{ mt: 0.5 }}>
          <InputLabel
            shrink
            sx={{
              color: textMut,
              fontWeight: 500,
              px: 0.5,                    // tiny background so lines don’t show through
              bgcolor: panel,
              "&.Mui-focused": { color: accent },
            }}
          >
            Difficulty
          </InputLabel>

          <Select
            value={value}
            label="Difficulty"
            inputRef={selectRef}
            onChange={(e) => onSelect(String(e.target.value))}
            autoFocus
            MenuProps={{
              disableScrollLock: true,
              PaperProps: {
                sx: {
                  bgcolor: panel,
                  color: textPri,
                  border: `1px solid ${border}`,
                  boxShadow: T.shadows.md,
                  maxHeight: 360,
                  borderRadius: 2,
                },
              },
            }}
            sx={{
              color: textPri,
              borderRadius: 2,
              backgroundColor: alpha("#fff", 0.015),
              minHeight: 64,
              px: 1.5,
              "& .MuiSelect-icon": { color: textPri },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: border },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#fff", 0.35) },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: accent },
            }}
          >
            {(["mixed", "easy", "medium", "hard"] as const).map((k) => {
              const { label, desc, Icon } = DIFF_META[k];
              return (
                <MenuItem
                  key={k}
                  value={k}
                  sx={{
                    py: 1.2,
                    gap: 1,
                    alignItems: "flex-start",
                    "&.Mui-selected": { bgcolor: alpha(accent, 0.08) },
                    "&.Mui-selected:hover": { bgcolor: alpha(accent, 0.12) },
                  }}
                >
                  <Icon
                    sx={{
                      mt: 0.2,
                      fontSize: 22,
                      color:
                        k === "hard" ? "#ff7a7a" : k === "easy" ? "#86efac" : k === "medium" ? "#60a5fa" : accent,
                    }}
                  />
                  <Stack spacing={0.2}>
                    <Typography sx={{ fontWeight: 700 }}>{label}</Typography>
                    <Typography variant="caption" sx={{ color: textMut, lineHeight: 1.3 }}>
                      {desc}
                    </Typography>
                  </Stack>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Typography variant="caption" sx={{ display: "block", mt: 1.25, color: textMut }}>
          Tip: “Mixed” gives a realistic spread. You can change difficulty any time.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2 }}>
        <Button
          onClick={onClose}
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
          onClick={onConfirm}
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 999,
            px: 2.8,
            backgroundColor: accent,
            color: "#0d0f12",
            boxShadow: `0 0 0 0 ${alpha(accent, 0)}`,
            transition: "box-shadow .18s ease, transform .12s ease",
            "&:hover": {
              backgroundColor: T.colors.accentHover,
              transform: "translateY(-1px)",
              boxShadow: `0 0 0 3px ${alpha(accent, 0.22)}`,
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/** Subtle under-title glow bar, matching your headers */
const BoxGlow: React.FC = () => (
  <span
    aria-hidden
    style={{
      display: "inline-block",
      height: 2,
      width: 110,
      marginLeft: 10,
      borderRadius: 999,
      background: `linear-gradient(90deg, transparent, ${alpha("#2ECC71", 0.8)}, transparent)`,
      filter: "drop-shadow(0 0 4px rgba(46,204,113,.35))",
    }}
  />
);

export default DifficultyDialog;
