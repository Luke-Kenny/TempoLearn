// backend/src/routes/emotionFeedback.ts
import express from "express";
import { generateEmotionFeedback } from "../services/feedbackService";

const router = express.Router();

router.post("/", async (req, res) => {
  const { emotion, reason } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: "Emotion is required." });
  }

  try {
    const feedback = await generateEmotionFeedback(emotion, reason);
    res.json({ feedback });
  } catch (err) {
    console.error("Failed to generate feedback:", err);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

export default router;
