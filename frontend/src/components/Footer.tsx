import { Box, Container, Typography, styled, Link } from "@mui/material";

// * Styled Components
const CustomContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(5),
  flexWrap: "wrap",
  padding: theme.spacing(4),
  maxWidth: "1200px", // Sets max width for centered content
  width: "100%", // Ensures full width
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    textAlign: "center",
  },
}));

const FooterLink = styled(Link)(({ /** theme */  }) => ({
  fontSize: "16px",
  color: "#7A7A7E",
  fontWeight: "300",
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": {
    color: "#000",
  },
}));

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1C1C1D", // Dark footer background
        color: "white",
        padding: "30px 0",
        position: "relative", // Keep it at the bottom
        left: 0,
      }}
    >
      <CustomContainer>
        {/* About TempoLearn */}
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700", mb: 2 }}>
            About TempoLearn
          </Typography>
          <FooterLink href="#">What is TempoLearn?</FooterLink>
          <br />
          <FooterLink href="#">Our Vision</FooterLink>
          <br />
          <FooterLink href="#">Research & Development</FooterLink>
          <br />
        </Box>

        {/* Study Resources */}
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700", mb: 2 }}>
            Study Resources
          </Typography>
          <FooterLink href="#">Schedule Planner</FooterLink>
          <br />
          <FooterLink href="#">Notes</FooterLink>
          <br />
          <FooterLink href="#">Learning Analytics</FooterLink>
          <br />
          <FooterLink href="#">Study Guides</FooterLink>
        </Box>

        {/* Help & Support */}
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700", mb: 2 }}>
            Help & Support
          </Typography>
          <FooterLink href="#">FAQ - How to Use TempoLearn</FooterLink>
          <br />
          <FooterLink href="#">Technical Support</FooterLink>
          <br />
          <FooterLink href="#">Bug Reports</FooterLink>
          <br />
          <FooterLink href="#">Tutorials</FooterLink>
        </Box>

        {/* Legal & Policies */}
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700", mb: 2 }}>
            Legal & Policies
          </Typography>
          <FooterLink href="#">Academic Integrity</FooterLink>
          <br />
          <FooterLink href="#">Privacy Policy</FooterLink>
          <br />
          <FooterLink href="#">Terms of Service</FooterLink>
        </Box>

        {/* Contact & Feedback */}
        <Box>
          <Typography sx={{ fontSize: "20px", fontWeight: "700", mb: 2 }}>
            Contact & Feedback
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#D1D1D1", fontWeight: "500", mb: 2 }}>
            We'd love to hear from you!
          </Typography>
          <FooterLink href="mailto:lukekenny812@gmail.com">
            lukekenny812@gmail.com
          </FooterLink>
          <br />
          <FooterLink href="#"> Submit Feedback</FooterLink>
        </Box>
      </CustomContainer>
    </Box>
  );
}
