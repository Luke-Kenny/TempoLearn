import express from "express";
import { generateCustomNotes } from "../services/noteService";
import { db } from "../utils/firebaseAdmin";

const router = express.Router();

router.post("/", async (req, res) => {
  const { uid, materialId, parsedText } = req.body;

  if (!uid || !materialId || !parsedText) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const notes = await generateCustomNotes(parsedText);

    await db.collection("custom_notes").doc(materialId).set({
      uid,
      materialId,
      notes, // contains: summary, keyConcepts, visualSuggestions, flashcardStyleQA
      createdAt: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to generate/save notes:", err);
    res.status(500).json({ error: "Failed to generate notes." });
  }
});

export default router;
