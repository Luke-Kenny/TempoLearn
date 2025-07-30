import React from "react";
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
} from "@mui/material";

interface DifficultyDialogProps {
  open: boolean;
  difficulty: string;
  onClose: () => void;
  onSelect: (difficulty: string) => void;
  onConfirm: () => void;
}

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({
  open,
  difficulty,
  onClose,
  onSelect,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          borderRadius: 3,
          px: 2,
          py: 1.5,
        },
      }}
    >
      <DialogTitle sx={{ color: "#f8fafc", fontWeight: 600 }}>
        Select Quiz Difficulty
      </DialogTitle>

      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "#cbd5e1" }}>Difficulty</InputLabel>
          <Select
            value={difficulty}
            label="Difficulty"
            onChange={(e) => onSelect(e.target.value)}
            sx={{
              color: "#f8fafc",
              "& .MuiSelect-icon": { color: "#f8fafc" },
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#3b82f6" },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#1e293b",
                  color: "#f8fafc",
                },
              },
            }}
          >
            <MenuItem value="mixed">Mixed</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#cbd5e1",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#3b82f6",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DifficultyDialog;
