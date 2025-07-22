// Define allowed question types
export type QuestionType = "mcq" | "true_false" | "cloze" | "short_answer";

// Define cognitive levels based on Bloom’s Taxonomy
export type CognitiveLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

// Define difficulty levels
export type Difficulty = "easy" | "medium" | "hard";

// Main QuizQuestion type definition
export interface QuizQuestion {
  type: QuestionType;
  question: string;
  answer: string | boolean;
  difficulty: Difficulty;
  cognitive_level: CognitiveLevel;
  explanation?: string;
  options?: string[]; // Only present for MCQs
}

// Define full quiz structure (array of questions)
export type QuizSchema = QuizQuestion[];
