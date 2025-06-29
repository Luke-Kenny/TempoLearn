import { Box, Container, Typography, styled, Link } from "@mui/material";

// Styled wrapper
const FooterContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: theme.spacing(2),
}));

const FooterText = styled(Typography)({
  color: "#B0B0B0",
  fontSize: "0.9rem",
  fontWeight: 300,
});

const FooterLink = styled(Link)({
  color: "#8FBC8F",
  fontSize: "0.9rem",
  fontWeight: 400,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#141c24",
        color: "white",
        padding: "15px 0",
        position: "relative",
        bottom: 0,
      }}
    >
      <FooterContainer>
        <FooterText>
          A smarter, structured way to study. Our platform is under active development — exciting features are coming soon.
        </FooterText>

        <FooterLink href="mailto:lukekenny812@gmail.com">
          Contact: lukekenny812@gmail.com
        </FooterLink>

        <FooterText sx={{ fontSize: "0.75rem", mt: 2 }}>
          &copy; {new Date().getFullYear()} TempoLearn. All rights reserved.
        </FooterText>
      </FooterContainer>
    </Box>
  );
}
