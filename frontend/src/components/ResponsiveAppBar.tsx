// src/components/ResponsiveAppBar.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  ButtonBase,
  Button,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import { TOKENS as T } from "../theme/tokens";
import { useAuth } from "../context/AuthContext";

const ResponsiveAppBar: React.FC = () => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 8 });
  const { user, logout, loading } = useAuth();
  const isAuthed = Boolean(user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        // Top of page = fully opaque (no glare). After scroll = slightly translucent.
        backgroundColor: trigger ? alpha(T.colors.panel, 0.92) : T.colors.panel,
        color: T.colors.textPrimary,
        backdropFilter: "saturate(140%) blur(12px)",
        borderBottom: `1px solid ${alpha(T.colors.accent, trigger ? 0.28 : 0.22)}`,
        boxShadow: trigger ? "0 6px 20px rgba(0,0,0,.16)" : "none",
        transition: "background-color .2s ease, box-shadow .2s ease, border-color .2s ease",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 56,
          px: { xs: 2, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand — flush left */}
        <ButtonBase
          component={RouterLink}
          to="/"
          aria-label="TempoLearn home"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 1,
            p: 0.25,
            "&:focus-visible": {
              outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
              outlineOffset: 2,
            },
          }}
        >
          <SchoolIcon sx={{ color: T.colors.accent, fontSize: 20 }} aria-hidden />
          <Typography
            variant="h6"
            sx={{ ml: 1, fontWeight: 800, fontSize: "1rem", letterSpacing: 0, lineHeight: 1 }}
          >
            Tempo
            <Box component="span" sx={{ color: T.colors.accent }}>
              Learn
            </Box>
          </Typography>
        </ButtonBase>

        {/* Right CTA — compact */}
        {loading ? (
          <Button
            variant="contained"
            disableElevation
            disabled
            startIcon={<CircularProgress size={12} />}
            sx={{
              backgroundColor: T.colors.accent,
              color: "#0d0f12",
              borderRadius: 999,
              px: 1.5,
              py: 0.25,
              fontSize: "0.78rem",
              fontWeight: 700,
              minHeight: 28,
            }}
          >
            Loading
          </Button>
        ) : isAuthed ? (
          <Button
            onClick={handleLogout}
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: T.colors.accent,
              color: "#0d0f12",
              borderRadius: 999,
              px: 1.5,
              py: 0.25,
              fontSize: "0.78rem",
              fontWeight: 700,
              minHeight: 28,
              "&:hover": { backgroundColor: T.colors.accentHover },
              "&:focus-visible": {
                outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                outlineOffset: 2,
              },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/signin")}
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: T.colors.accent,
              color: "#0d0f12",
              borderRadius: 999,
              px: 1.5,
              py: 0.25,
              fontSize: "0.78rem",
              fontWeight: 700,
              minHeight: 28,
              "&:hover": { backgroundColor: T.colors.accentHover },
              "&:focus-visible": {
                outline: `3px solid ${alpha(T.colors.accent, 0.45)}`,
                outlineOffset: 2,
              },
            }}
          >
            Get Started
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveAppBar;
