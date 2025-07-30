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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0f2027",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box
            sx={{
              position: "relative",
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              borderRadius: 4,
              p: 4,
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                color: "#94a3b8",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h5"
              textAlign="center"
              fontWeight={700}
              sx={{ color: "#f1f5f9", mb: 2 }}
            > Sign In 
            </Typography>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontWeight: 500 }}>
                {error}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{
                  sx: {
                    color: "#fff",
                    backgroundColor: "#334155",
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                margin="normal"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{
                  sx: {
                    color: "#fff",
                    backgroundColor: "#334155",
                    borderRadius: 2,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "#94a3b8" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  backgroundColor: "#3b82f6",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 1.2,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#2563eb" },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Signup Redirect */}
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 3, color: "#cbd5e1" }}
            >
              Don&apos;t have an account?
              <Button
                onClick={() => navigate("/signup")}
                sx={{
                  textTransform: "none",
                  color: "#2ecc71",
                  fontWeight: 600,
                  ml: 0.5,
                  "&:hover": { color: "#27ae60" },
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignIn;
