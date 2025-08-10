// src/pages/SignUp.tsx
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { TOKENS as T } from "../theme/tokens";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate("/home");
    } catch {
      setError("Could not sign up. Try a stronger password or different email.");
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
            aria-label="Sign up form"
            sx={{
              position: "relative",
              backgroundColor: T.colors.panel,
              border: `1px solid ${T.colors.borderWeak}`,
              borderRadius: T.radius.md,
              boxShadow: T.shadows.md,
              p: 3.25,
            }}
          >
            {/* Close Button */}
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

            {/* Title */}
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: 800, color: T.colors.textPrimary, mb: 2 }}
            >
              Sign Up
            </Typography>

            {/* Error Message */}
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

            {/* Form */}
            <Box component="form" onSubmit={handleSignUp} noValidate>
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
                autoComplete="new-password"
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
                  height: 44,
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
                {loading ? <CircularProgress size={20} color="inherit" /> : "Sign Up"}
              </Button>
            </Box>

            {/* Navigation to Sign In */}
            <Box
              sx={{
                mt: 2.5,
                display: "flex",
                justifyContent: "center",
                color: T.colors.textMuted,
                gap: 1,
              }}
            >
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signin");
                  }}
                  href="/signin"
                  underline="hover"
                  sx={{ color: T.colors.accent, fontWeight: 600, cursor: "pointer" }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignUp;
