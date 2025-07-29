import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CustomNotes {
  summary: string;
  keyConcepts: string[];
  visualSuggestions: string[];
  notableInsights: string[]; // Replaces flashcards
}

export const generateCustomNotes = async (
  parsedText: string
): Promise<CustomNotes> => {
  const prompt = `
You are an AI academic assistant. Convert the following academic content into structured, thesis-level notes for postgraduate study.

CONTENT:
"""
${parsedText}
"""

INSTRUCTIONS:
- Write a high-level academic summary (2-3 paragraphs), with clear structure and insight.
- Extract 4-8 key academic terms or concepts relevant to the material.
- Suggest visuals that aid conceptual understanding (e.g., flowcharts, models).
- Generate 3-5 notable study insights or observations — compact, powerful, and actionable. These should resemble margin notes, critical takeaways, or "NB" points.
- Do not include markdown, headings, explanations, or extra commentary.

RETURN ONLY valid JSON in this format:
{
  "summary": "Your academic summary here...",
  "keyConcepts": [
    "Key Term 1",
    "Key Term 2",
    ...
  ],
  "visualSuggestions": [
    "Diagram of concept A",
    "Flowchart of framework B",
    ...
  ],
  "notableInsights": [
    "Short, high-impact insight 1",
    "Important distinction or observation 2",
    ...
  ]
}
  `.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.25,
  });

  const raw = completion.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("OpenAI returned an empty response.");

  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Response did not contain a valid JSON object.");
  }

  const cleaned = raw.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned) as CustomNotes;
  } catch (err) {
    console.error("Failed to parse OpenAI JSON:\n", cleaned);
    throw new Error("Custom notes response was not valid JSON.");
  }
};
