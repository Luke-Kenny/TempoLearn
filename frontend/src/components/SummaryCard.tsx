import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import { TOKENS as T } from "../theme/tokens";

interface Props {
  title: string;
  value: string | number;
}

const SummaryCard: React.FC<Props> = ({ title, value }) => {
  return (
    <Card
      sx={{
        bgcolor: T.colors.panel,
        color: T.colors.textPrimary,
        borderRadius: 3,
        border: `1px solid ${T.colors.borderWeak}`,
        boxShadow: T.shadows.md,
        height: "100%",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: T.shadows.lg,
        },
      }}
    >
      <CardContent sx={{ py: 2.5, px: 2.5 }}>
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            sx={{ color: T.colors.textMuted, fontWeight: 500, letterSpacing: 0.3 }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: T.colors.accent,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
