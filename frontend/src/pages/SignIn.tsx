// src/pages/SignIn.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { TOKENS as T } from "../theme/tokens";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/home");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        // same background system as landing
        background: `
          radial-gradient(1200px 700px at -10% 0%, rgba(46,204,113,0.07) 0%, transparent 60%),
          radial-gradient(1200px 700px at 115% 20%, rgba(46,204,113,0.05) 0%, transparent 60%),
          linear-gradient(to bottom right, ${T.colors.heroA}, ${T.colors.heroB})
        `,
      }}
    >
      <Container maxWidth="xs">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Box
            component="section"
            aria-label="Sign in form"
            sx={{
              position: "relative",
              backgroundColor: T.colors.panel,
              border: `1px solid ${T.colors.borderWeak}`,
              borderRadius: T.radius.md,              // ← squarer
              boxShadow: T.shadows.md,                 // subtle
              p: 3.25,                                 // compact & tidy
            }}
          >
            <IconButton
              onClick={() => navigate("/")}
              aria-label="Back to home"
              size="small"
              sx={{
                position: "absolute",
                top: 15,
                left: 15,
                color: T.colors.textMuted,
                "&:focus-visible": {
                  outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                  outlineOffset: 2,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 800, color: T.colors.textPrimary, mb: 2 }}
            >
              Sign In
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  backgroundColor: alpha("#ff1744", 0.08),
                  border: `1px solid ${alpha("#ff1744", 0.35)}`,
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSignIn} noValidate>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                InputLabelProps={{ sx: { color: T.colors.textMuted } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fff", 0.02),
                    borderRadius: T.radius.md,
                    color: T.colors.textPrimary,
                    "& fieldset": { borderColor: T.colors.borderWeak },
                    "&:hover fieldset": { borderColor: alpha("#fff", 0.35) },
                    "&.Mui-focused fieldset": { borderColor: T.colors.accent },
                  },
                  "& input:-webkit-autofill": {
                    WebkitTextFillColor: T.colors.textPrimary,
                    WebkitBoxShadow: `0 0 0 100px ${alpha("#fff", 0.02)} inset`,
                  },
                }}
              />

              <TextField
                fullWidth
                required
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputLabelProps={{ sx: { color: T.colors.textMuted } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        sx={{
                          color: T.colors.textMuted,
                          "&:focus-visible": {
                            outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                            outlineOffset: 2,
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha("#fff", 0.02),
                    borderRadius: T.radius.md,
                    color: T.colors.textPrimary,
                    "& fieldset": { borderColor: T.colors.borderWeak },
                    "&:hover fieldset": { borderColor: alpha("#fff", 0.35) },
                    "&.Mui-focused fieldset": { borderColor: T.colors.accent },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2.25,
                  height: 44,                           // compact, not chunky
                  backgroundColor: T.colors.accent,
                  color: "#0d0f12",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: T.radius.md,
                  boxShadow: T.shadows.md,
                  "&:hover": { backgroundColor: T.colors.accentHover },
                  "&:focus-visible": {
                    outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
            <Box
              sx={{
                mt: 2.5,
                display: "flex",
                justifyContent: "center", // centered horizontally
                alignItems: "center",
                color: T.colors.textMuted,
                textAlign: "center", // ensures the text itself is centered
              }}
            >
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}
                  href="/signup"
                  underline="hover"
                  sx={{ color: T.colors.accent, fontWeight: 600, cursor: "pointer" }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignIn;
