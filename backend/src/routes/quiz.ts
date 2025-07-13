import express from "express";
import { generateQuiz } from "../services/quizService";

const router = express.Router();

router.post("/", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "No content provided." });
  }

  try {
    const quiz = await generateQuiz(content);
    res.json({ quiz });
  } catch (error) {
    console.error("Quiz generation failed:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

export default router;
