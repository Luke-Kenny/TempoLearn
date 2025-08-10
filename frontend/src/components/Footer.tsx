// src/components/Footer.tsx
import { useState, useEffect } from "react";
import { Box, Container, Typography, styled, Link } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { TOKENS as T } from "../theme/tokens";

// Slightly less bright accent tone
const mutedAccent = "#3fc57b"; // softer than #4ade80

const FooterContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: theme.spacing(1.5),
  fontFamily: `"Inter", "Helvetica Neue", Arial, sans-serif`,
}));

const FooterText = styled(Typography)({
  color: T.colors.textMuted,
  fontSize: "0.9rem",
  fontWeight: 300,
  maxWidth: 720,
  fontFamily: `"Inter", "Helvetica Neue", Arial, sans-serif`,
});

const FooterLink = styled(Link)({
  color: mutedAccent,
  fontSize: "0.9rem",
  fontWeight: 500,
  textDecoration: "none",
  fontFamily: `"Inter", "Helvetica Neue", Arial, sans-serif`,
  transition: "color 0.2s ease",
  "&:hover": {
    textDecoration: "underline",
    color: "#34b36d", // hover slightly darker
  },
  "&:focus-visible": {
    outline: `2px solid ${mutedAccent}55`,
    outlineOffset: 2,
    borderRadius: 4,
  },
});

export default function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
      setShowFooter(scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showFooter && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Box
            component="footer"
            sx={{
              width: "100%",
              background: "transparent",
              borderTop: `1px solid ${T.colors.borderWeak}`,
              boxShadow: "none",
            }}
          >
            <FooterContainer>
              <FooterText>
                A smarter, structured way to study. Our platform is under active
                development — exciting features are coming soon.
              </FooterText>

              <FooterLink href="mailto:lukekenny812@gmail.com">
                Contact: lukekenny812@gmail.com
              </FooterLink>

              <FooterText sx={{ fontSize: "0.75rem", mt: 1 }}>
                &copy; {new Date().getFullYear()} TempoLearn. All rights reserved.
              </FooterText>
            </FooterContainer>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
