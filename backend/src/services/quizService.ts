// src/services/quizService.ts

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuiz = async (
  content: string
): Promise<
  {
    question: string;
    options: string[];
    answer: string;
  }[]
> => {
  if (!content || content.length < 100) {
    throw new Error("Provided content is insufficient for quiz generation.");
  }

  const prompt = `
You are a quiz generation engine. Your task is to analyze academic text and extract **exactly 3 multiple-choice questions** in a **single JSON array**.

GOALS:
- Create questions that evaluate conceptual comprehension.
- Focus on cause/effect, definitions, relationships, applications — not trivia.

STRICT RULES:
- Return ONE JSON array (not multiple).
- Each object must have:
  - "question": string
  - "options": array of 4 strings
  - "answer": string (must match one of the options exactly)
- NO Markdown, code blocks, or explanation. JUST the array.

FORMAT:
[
  {
    "question": "What is the primary function of X?",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  },
  {
    ...
  },
  {
    ...
  }
]

STUDY CONTENT:
"""
${content}
"""
`;


  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temp = less variation/hallucination
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error("Empty response received from OpenAI.");
    }

    console.log("Raw OpenAI Output:\n", raw); // helpful for debugging

    let quiz;
    try {
      quiz = JSON.parse(raw);
    } catch (parseErr) {
      // This helps debug malformed output and improves developer feedback
      console.error("Invalid JSON returned from OpenAI:\n", raw);
      throw new Error("Failed to parse quiz data. Invalid JSON format.");
    }

    if (!Array.isArray(quiz) || quiz.length < 1) {
      throw new Error("Quiz data is not a valid array.");
    }

    for (const q of quiz) {
      if (
        typeof q.question !== "string" ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.answer !== "string"
      ) {
        throw new Error("Quiz format is incorrect or incomplete.");
      }
    }

    return quiz;
  } catch (err: any) {
    console.error("Quiz generation error:", err.message || err);
    throw new Error("Quiz generation failed. Please try again.");
  }
};
