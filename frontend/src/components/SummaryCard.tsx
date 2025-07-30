import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  title: string;
  value: string | number;
}

const SummaryCard: React.FC<Props> = ({ title, value }) => {
  return (
    <Card
      sx={{
        backgroundColor: "#1e293b",
        color: "#f8fafc",
        borderRadius: 3,
        boxShadow: "0 0 12px rgba(0,0,0,0.25)",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
