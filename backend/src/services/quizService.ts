import { OpenAI } from "openai";

// Initializing my OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Defines the expected question structure
export type QuizQuestion = {
  type: "mcq" | "true_false" | "cloze" | "short_answer";
  question: string;
  answer: string | boolean;
  difficulty: "easy" | "medium" | "hard";
  cognitive_level:
    | "remember"
    | "understand"
    | "apply"
    | "analyze"
    | "evaluate"
    | "create";
  explanation?: string;
  options?: string[]; // Only for MCQs
};

// Runtime validation for each question
function isValidQuestion(obj: any): obj is QuizQuestion {
  const baseCheck =
    typeof obj.question === "string" &&
    ["easy", "medium", "hard"].includes(obj.difficulty) &&
    [
      "remember",
      "understand",
      "apply",
      "analyze",
      "evaluate",
      "create",
    ].includes(obj.cognitive_level) &&
    ["mcq", "true_false", "cloze", "short_answer"].includes(obj.type);

  if (!baseCheck) return false;

  if (obj.type === "mcq") {
    return (
      Array.isArray(obj.options) &&
      obj.options.length === 4 &&
      obj.options.every((opt: string) => typeof opt === "string") &&
      typeof obj.answer === "string" &&
      obj.options.includes(obj.answer)
    );
  }

  if (obj.type === "true_false") {
    return typeof obj.answer === "boolean";
  }

  return typeof obj.answer === "string";
}

// Difficulty-to-question-type mapping
const typeMap = {
  easy: ["mcq", "true_false"],
  medium: ["mcq", "true_false", "cloze"],
  hard: ["mcq", "cloze", "short_answer"],
};

// Main quiz generation function
export const generateQuiz = async (
  content: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<QuizQuestion[]> => {
  if (!content || content.length < 100) {
    throw new Error("Provided content is insufficient for quiz generation.");
  }

  const allowedTypes = typeMap[difficulty];

  const prompt = `
You are an AI quiz engine. Given academic content, generate a diagnostic quiz to assess conceptual understanding.

TASK:
- Generate 5 to 7 questions.
- Use only the following question types (based on difficulty level "${difficulty}"): ${allowedTypes.join(", ")}

QUESTION TYPES:
- "mcq": Multiple-choice with exactly 4 options. One of them must be the correct answer.
- "true_false": True or false.
- "cloze": Fill-in-the-blank.
- "short_answer": Brief open-ended response.

EACH QUESTION MUST INCLUDE:
- "type": one of: ${allowedTypes.join(", ")}
- "question": the question text
- "answer": correct answer (string or boolean)
- "difficulty": "easy", "medium", or "hard"
- "cognitive_level": "remember", "understand", "apply", "analyze", "evaluate", or "create"
- Optional: "options": for "mcq" only (must be exactly 4 strings and must include the correct answer)
- Optional: "explanation": a short explanation for the answer

IMPORTANT:
Return only the JSON array. No extra text, markdown, or comments.

CONTENT:
"""
${content}
"""`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();
    if (!raw) throw new Error("OpenAI returned an empty response.");

    console.log("Raw OpenAI Output:\n", raw);

    const jsonStart = raw.indexOf("[");
    const jsonEnd = raw.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Response did not contain a valid JSON array.");
    }

    const cleaned = raw.slice(jsonStart, jsonEnd + 1);
    let parsed: any;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse OpenAI JSON:\n", cleaned);
      throw new Error("Quiz JSON could not be parsed.");
    }

    if (!Array.isArray(parsed) || parsed.length < 5 || parsed.length > 7) {
      throw new Error("Quiz must contain 5 to 7 questions.");
    }

    for (let i = 0; i < parsed.length; i++) {
      if (!isValidQuestion(parsed[i])) {
        console.error("Invalid question format at index", i, ":", parsed[i]);
        throw new Error(`Question ${i + 1} failed validation.`);
      }
    }

    return parsed;
  } catch (err: any) {
    console.error("Quiz generation error:", err.message || err);
    throw new Error("Quiz generation failed. Please try again.");
  }
};
