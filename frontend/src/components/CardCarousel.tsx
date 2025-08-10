// src/components/CardCarousel.tsx
import React, { useCallback, useMemo, useState } from "react";
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion, AnimatePresence } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import FeatureCard from "./FeatureCard";
import { cardData } from "../data/cardData";
import { TOKENS as T } from "../theme/tokens";

const SWIPE_THRESHOLD = 80;

const variants = {
  enter: (dir: "left" | "right") => ({ x: dir === "right" ? -48 : 48, opacity: 0, scale: 0.985 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: "left" | "right") => ({ x: dir === "right" ? 48 : -48, opacity: 0, scale: 0.985 }),
};

const CardCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const CARD_W = useMemo(() => (mdUp ? 420 : smDown ? 320 : 360), [mdUp, smDown]);
  const CARD_H = useMemo(() => (mdUp ? 300 : 260), [mdUp]);

  const total = cardData.length;

  const go = useCallback(
    (dir: "left" | "right") => {
      setDirection(dir);
      setIndex((prev) => (dir === "right" ? (prev + 1) % total : (prev - 1 + total) % total));
    },
    [total]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go("left");
    if (e.key === "ArrowRight") go("right");
  };

  const card = cardData[index];

  return (
    <Box
      sx={{
        mt: { xs: 4, md: 5 },
        mb: { xs: 6, md: 8 },
        display: "grid",
        placeItems: "center",
        position: "relative",
        outline: "none",
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="TempoLearn quick navigation"
    >
      <Box sx={{ position: "relative", width: CARD_W, height: CARD_H }}>
        {/* Left Arrow*/}
        <Tooltip title="Previous" arrow>
          <IconButton
            onClick={() => go("left")}
            aria-label="Previous card"
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translate(-120%, -50%)", // ← symmetric offset
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: alpha("#0b0e13", 0.35),
              color: alpha("#fff", 0.9),
              backdropFilter: "saturate(140%) blur(8px)",
              border: `1px solid ${alpha("#fff", 0.18)}`,
              boxShadow: T.shadows.md,
              "&:hover": { backgroundColor: alpha("#0b0e13", 0.5) },
              zIndex: 2,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>

        {/* Card */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={card.title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.9 }}
            style={{ position: "absolute", width: "100%", height: "100%" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.55}
            onDragEnd={(_, info) => {
              if (info.offset.x > SWIPE_THRESHOLD) go("left");
              else if (info.offset.x < -SWIPE_THRESHOLD) go("right");
            }}
          >
            <FeatureCard
              title={card.title}
              icon={card.icon}
              color={card.color}
              description={card.description}
              ctaLabel={card.ctaLabel ?? "Open"}
              onClick={() => navigate(card.route)}   
            />
          </motion.div>
        </AnimatePresence>

        {/* Right Arrow*/}
        <Tooltip title="Next" arrow>
          <IconButton
            onClick={() => go("right")}
            aria-label="Next card"
            sx={{
              position: "absolute",
              right: 40,
              top: "50%",
              transform: "translate(120%, -50%)", // ← symmetric offset
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: alpha("#0b0e13", 0.35),
              color: alpha("#fff", 0.9),
              backdropFilter: "saturate(140%) blur(8px)",
              border: `1px solid ${alpha("#fff", 0.18)}`,
              boxShadow: T.shadows.md,
              "&:hover": { backgroundColor: alpha("#0b0e13", 0.5) },
              zIndex: 2,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Progress dots */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden
      >
        {cardData.map((_, i) => {
          const active = i === index;
          return (
            <Box
              key={i}
              sx={{
                width: active ? 26 : 8,
                height: 8,
                borderRadius: 999,
                transition: "all .18s ease",
                backgroundColor: active ? alpha(T.colors.accent, 0.9) : alpha("#fff", 0.22),
                border: `1px solid ${
                  active ? alpha(T.colors.accent, 0.5) : alpha("#fff", 0.15)
                }`,
                boxShadow: active ? T.shadows.md : "none",
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default CardCarousel;
