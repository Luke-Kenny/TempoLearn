import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  IconButton,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import "../styles/Auth.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to Home upon successful signup
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box className="auth-box">
            {/* Close Button */}
            <IconButton className="close-button" onClick={() => navigate("/")}>
              <CloseIcon />
            </IconButton>

            <Typography variant="h5" className="auth-title">
              Sign Up
            </Typography>
            {error && <Typography className="error-text">{error}</Typography>}
            <form onSubmit={handleSignUp}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Button
                onClick={() => navigate("/signin")}
                sx={{ color: "#228B22" }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </div>
  );
};

export default SignUp;
