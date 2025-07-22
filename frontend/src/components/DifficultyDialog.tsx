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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Quiz Difficulty</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            label="Difficulty"
            onChange={(e) => onSelect(e.target.value)}
          >
            <MenuItem value="mixed">Mixed</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DifficultyDialog;
