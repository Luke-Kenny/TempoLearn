import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generating a MCQ from study content.
 * Enforces strict JSON structure and validates each question object.
 */
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
You are an AI-powered quiz generation engine designed to analyze academic content and generate multiple-choice questions that test conceptual understanding.

TASK:
From the academic text provided below, generate exactly **3 multiple-choice questions** in a single **JSON array**. The questions must focus on higher-order thinking — such as comprehension, application, causation, distinction, or implication — not mere fact recall.

REQUIRED OUTPUT STRUCTURE:
Return only a valid JSON array like this (NO markdown, code blocks, extra text, or comments):

[
  {
    "question": "What is the main purpose of X?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option B"
  },
  ...
]

STRICT RULES:
- Return exactly 3 question objects inside ONE array.
- Each object must have:
  - "question": a clear and concise question string.
  - "options": an array of 4 unique and plausible string options.
  - "answer": a string that matches EXACTLY one of the options.
- Do not use formatting, symbols, or explain anything. Only return the JSON.
- Ensure option and answer values are **textually identical**. (e.g., if the answer is "Transparency", that exact string must appear in options).
- Do not include instructions, intro text, or annotations of any kind — just the raw array.

STUDY MATERIAL TO ANALYZE:
"""
${content}
"""
`;




  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();
    if (!raw) {
      throw new Error("Empty response received from OpenAI.");
    }

    console.log("Raw OpenAI Output:\n", raw);

    // sanitizing: extracting only the first JSON array block
    const jsonStart = raw.indexOf("[");
    const jsonEnd = raw.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("OpenAI response did not contain a valid JSON array.");
    }

    const cleaned = raw.slice(jsonStart, jsonEnd + 1);
    let quiz;

    try {
      quiz = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse sanitized JSON:\n", cleaned);
      throw new Error("Failed to parse quiz data. Invalid JSON format.");
    }

    if (!Array.isArray(quiz) || quiz.length !== 3) {
      throw new Error("Quiz must contain exactly 3 questions.");
    }

    for (const q of quiz) {
      if (
        typeof q.question !== "string" ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.answer !== "string" ||
        !q.options.includes(q.answer)
      ) {
        throw new Error("Invalid question format or missing fields.");
      }
    }

    return quiz;
  } catch (err: any) {
    console.error("Quiz generation error:", err.message || err);
    throw new Error("Quiz generation failed. Please try again.");
  }
};
