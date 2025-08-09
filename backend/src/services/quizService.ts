import { OpenAI } from "openai";

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
  options?: string[]; // For MCQs
};

const normalize = (input: string) =>
  input.trim().toLowerCase().replace(/[^\w\s]/g, "");

const validLevels = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
];

const coerceLevel = (level: string): QuizQuestion["cognitive_level"] | null => {
  const normalized = level.trim().toLowerCase();
  return validLevels.includes(normalized)
    ? (normalized as QuizQuestion["cognitive_level"])
    : null;
};

function isValidQuestion(obj: any): obj is QuizQuestion {
  const typeCheck = ["mcq", "true_false", "cloze", "short_answer"].includes(obj.type);
  const difficultyCheck = ["easy", "medium", "hard"].includes(obj.difficulty);
  const levelCheck = validLevels.includes(obj.cognitive_level);
  const base = typeof obj.question === "string" && difficultyCheck && levelCheck && typeCheck;

  if (!base) return false;

  if (obj.type === "mcq") {
    return (
      Array.isArray(obj.options) &&
      obj.options.length === 4 &&
      obj.options.every((opt: string) => typeof opt === "string") &&
      typeof obj.answer === "string" &&
      obj.options.some((opt: string) => normalize(opt) === normalize(obj.answer))
    );
  }

  if (obj.type === "true_false") {
    return typeof obj.answer === "boolean";
  }

  return typeof obj.answer === "string";
}

const typeMap = {
  easy: ["mcq", "true_false"],
  medium: ["mcq", "true_false", "cloze"],
  hard: ["mcq", "cloze", "short_answer"],
};

export function createOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateQuiz(
  content: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
  openaiClient = createOpenAI()
): Promise<QuizQuestion[]> {
  if (!content || content.length < 100) {
    throw new Error("Provided content is insufficient for quiz generation.");
  }

  const allowedTypes = typeMap[difficulty];

  const prompt = `
You are an AI quiz engine. Based on the academic content below, generate a JSON array of 5 to 7 quiz questions.

Only use question types appropriate for difficulty "${difficulty}": ${allowedTypes.join(", ")}.
Cognitive levels must be: remember, understand, apply, analyze, evaluate, create (lowercase only).

Each question must include:
- type: "mcq", "true_false", "cloze", or "short_answer"
- question: string
- answer: string or boolean
- difficulty: "easy", "medium", or "hard"
- cognitive_level: one of the six levels above
- options: only for "mcq" (exactly 4 options including the correct one)
- explanation: (optional)

Return only a valid **JSON array**, no markdown, no preamble, no extra text.

CONTENT:
"""
${content}
"""`;

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const raw = completion.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error("OpenAI returned an empty response.");

  const jsonStart = raw.indexOf("[");
  const jsonEnd = raw.lastIndexOf("]");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Response did not contain a valid JSON array.");
  }

  const cleaned = raw.slice(jsonStart, jsonEnd + 1);
  let parsed: any;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Quiz JSON could not be parsed.");
  }

  if (!Array.isArray(parsed) || parsed.length < 5 || parsed.length > 7) {
    throw new Error("Quiz must contain 5 to 7 questions.");
  }

  for (let i = 0; i < parsed.length; i++) {
    const q = parsed[i];
    q.cognitive_level = coerceLevel(q.cognitive_level) ?? "understand";

    if (q.type === "mcq" && Array.isArray(q.options) && typeof q.answer === "string") {
      const matched = q.options.find((opt: string) => normalize(opt) === normalize(q.answer));
      if (matched) q.answer = matched;
      else throw new Error(`Question ${i + 1} has an invalid MCQ answer.`);
    }

    if (!isValidQuestion(q)) {
      throw new Error(`Question ${i + 1} failed validation.`);
    }
  }

  return parsed as QuizQuestion[];
}
