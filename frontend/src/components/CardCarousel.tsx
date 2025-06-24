import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FeatureCard from "./FeatureCard";
import { cardData } from "../data/cardData";
import { motion, AnimatePresence } from "framer-motion";

const VISIBLE_CARDS = 3;

const CardCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const totalCards = cardData.length;

  const handleScroll = (dir: "left" | "right") => {
    setDirection(dir);
    setExpandedCard(null);

    setCurrentIndex((prev) =>
      dir === "left"
        ? (prev - 1 + totalCards) % totalCards
        : (prev + 1) % totalCards
    );
  };

  const visibleCards = Array.from({ length: VISIBLE_CARDS }, (_, i) => {
    const index = (currentIndex + i) % totalCards;
    return cardData[index];
  });

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 6,
        mb: 12,
        px: 2,
        overflow: "hidden",
        maxWidth: "100%",
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={() => handleScroll("left")}
        sx={{
          position: "absolute",
          left: { xs: 8, sm: 32 },
          zIndex: 2,
          backgroundColor: "#2c3e50",
          color: "#fff",
          p: 1.5,
          "& svg": { fontSize: 32 },
          "&:hover": {
            backgroundColor: "#34495e",
            transform: "scale(1.1)",
            transition: "0.2s ease",
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Cards Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          overflow: "hidden",
          minHeight: 360,
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {visibleCards.map((card) => (
            <motion.div
              key={card.title}
              custom={direction}
              initial={{ x: direction === "right" ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === "right" ? -100 : 100, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              style={{ flexShrink: 0 }}
            >
              <FeatureCard
                {...card}
                isExpanded={expandedCard === card.title}
                onToggle={() =>
                  setExpandedCard((prev) =>
                    prev === card.title ? null : card.title
                  )
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={() => handleScroll("right")}
        sx={{
          position: "absolute",
          right: { xs: 8, sm: 32 },
          zIndex: 2,
          backgroundColor: "#2c3e50",
          color: "#fff",
          p: 1.5,
          "& svg": { fontSize: 32 },
          "&:hover": {
            backgroundColor: "#34495e",
            transform: "scale(1.1)",
            transition: "0.2s ease",
          },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default CardCarousel;
