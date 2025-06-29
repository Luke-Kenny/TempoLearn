import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FeatureCard from "./FeatureCard";
import { cardData } from "../data/cardData";
import { motion, AnimatePresence } from "framer-motion";

const CARD_WIDTH = 320;
const CARD_HEIGHT = 400;

const variants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? -300 : 300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? 300 : -300,
    opacity: 0,
  }),
};

const CardCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const totalCards = cardData.length;

  const paginate = (dir: "left" | "right") => {
    setDirection(dir);
    setExpandedCard(null);
    setIndex((prev) =>
      dir === "right"
        ? (prev + 1) % totalCards
        : (prev - 1 + totalCards) % totalCards
    );
  };

  return (
    <Box
      sx={{
        mt: 6,
        mb: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          position: "relative",
        }}
      >
        {/* Left Arrow */}
        <IconButton
          onClick={() => paginate("left")}
          sx={{
            position: "absolute",
            left: 4,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#2c3e50",
            color: "#fff",
            "&:hover": { backgroundColor: "#34495e" },
            zIndex: 2,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Animated Card */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={cardData[index].title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            style={{ position: "absolute", width: "100%" }}
          >
            <FeatureCard
              {...cardData[index]}
              isExpanded={expandedCard === cardData[index].title}
              onToggle={() =>
                setExpandedCard((prev) =>
                  prev === cardData[index].title ? null : cardData[index].title
                )
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Right Arrow */}
        <IconButton
          onClick={() => paginate("right")}
          sx={{
            position: "absolute",
            right: 4,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#2c3e50",
            color: "#fff",
            "&:hover": { backgroundColor: "#34495e" },
            zIndex: 2,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CardCarousel;
