// src/components/FeatureCard.tsx
import React from "react";
import { Box, Card, CardContent, Typography, ButtonBase } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TOKENS as T } from "../theme/tokens";

/** Keep in sync with CardCarousel */
const CARD_WIDTH = 380; // ← was 320

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  color?: string;              // accent color
  description: string;         // short summary (1–2 lines)
  ctaLabel?: string;           // defaults to "Open"
  onClick: () => void;         // activate
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  color,
  description,
  ctaLabel = "Open",
  onClick,
}) => {
  const accent = color ?? T.colors.accent;
  const ring = alpha(accent, 0.45);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Box
      sx={{
        width: CARD_WIDTH,
        height: 260,
        borderRadius: T.radius.md,
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <ButtonBase
        onClick={onClick}
        onKeyDown={handleKeyDown}
        focusRipple
        role="button"
        aria-label={`${title} card`}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: T.radius.md,
          textAlign: "left",
        }}
      >
        <Card
          elevation={0}
          sx={{
            height: "100%",
            width: "100%",
            borderRadius: T.radius.md,
            backgroundColor: T.colors.panel,
            border: `1px solid ${T.colors.borderWeak}`,
            boxShadow: T.shadows.md,
            position: "relative",
            overflow: "hidden",
            transition: "border-color .18s ease, box-shadow .18s ease",
            "&:hover": { borderColor: ring, boxShadow: T.shadows.lg },
            "&:focus-within": { outline: `3px solid ${ring}`, outlineOffset: 2 },
            "&:before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0))",
              pointerEvents: "none",
            },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              p: 3,
              gap: 1,
            }}
          >
            {/* Icon chip */}
            <Box
              aria-hidden
              sx={{
                width: 46,
                height: 46,
                borderRadius: T.radius.md,
                display: "grid",
                placeItems: "center",
                backgroundColor: alpha(accent, 0.16),
                border: `1px solid ${alpha(accent, 0.45)}`,
              }}
            >
              <Box sx={{ "& > *": { color: accent, fontSize: 24 } }}>{icon}</Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{ mt: 0.5, fontWeight: 800, color: T.colors.textPrimary, lineHeight: 1.25 }}
            >
              {title}
            </Typography>

            {/* Description (2-line clamp) */}
            <Typography
              variant="body2"
              sx={{
                color: T.colors.textMuted,
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                pr: 0.5,
              }}
            >
              {description}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* CTA Row */}
            <Box
              sx={{
                mt: 1,
                pt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `1px solid ${alpha("#fff", 0.08)}`,
              }}
            >
              <Typography variant="body2" sx={{ color: alpha("#fff", 0.9), fontWeight: 600 }}>
                {ctaLabel}
              </Typography>
              <ChevronRightIcon
                sx={{
                  color: accent,
                  transition: "transform .18s ease",
                  ".MuiButtonBase-root:hover &": { transform: "translateX(3px)" },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </ButtonBase>
    </Box>
  );
};

export default FeatureCard;
