/**
 * Custom eval on whether a given academic text is suitable for quiz generation.
 * Using heuristic scoring based on structural, semantic, and lexical signals.
 */

interface EvaluationResult {
  isQuizWorthy: boolean;
  confidenceScore: number; // 0 to 1
  reasons: string[];
  debug?: {
    wordCount: number;
    academicHits: number;
    structureHits: number;
    lexicalDensity: number;
  };
}

export const isContentQuizWorthy = (text: string): EvaluationResult => {
  if (typeof text !== "string" || text.trim().length === 0) {
    return {
      isQuizWorthy: false,
      confidenceScore: 0,
      reasons: ["Empty or invalid input."],
    };
  }

  const cleanedText = text.trim();
  const lowerText = cleanedText.toLowerCase();
  const words = cleanedText.split(/\s+/);
  const wordCount = words.length;

  // Blocked boilerplate/admin phrases
  const BLOCKED_PHRASES = [
    "assignment brief", "assessment criteria", "marking rubric", "due date",
    "turnitin", "canvas", "moodle", "student id", "submission portal",
    "how to submit", "plagiarism", "file naming convention",
    "this assignment", "feedback will be provided", "instructions",
    "lorem ipsum", "contact your instructor", "page is intentionally left blank",
  ];
  const disallowed = BLOCKED_PHRASES.filter((phrase) =>
    lowerText.includes(phrase)
  );
  if (disallowed.length > 0) {
    return {
      isQuizWorthy: false,
      confidenceScore: 0,
      reasons: [`Contains boilerplate content: "${disallowed[0]}"`],
    };
  }

  // Academic signals — cross-disciplinary
  const ACADEMIC_TERMS = [
    "hypothesis", "methodology", "literature review", "framework", "empirical",
    "quantitative", "qualitative", "findings", "dataset", "case study",
    "argument", "premise", "theoretical", "variable", "analysis",
    "evidence", "discussion", "results", "correlation", "conclusion",
    "citation", "construct", "conceptual", "data", "inference", "observation"
  ];
  const academicHits = ACADEMIC_TERMS.filter((term) =>
    lowerText.includes(term)
  ).length;

  // Structural cues
  const STRUCTURE_MARKERS = [
    "introduction", "abstract", "methods", "discussion", "references", "bibliography"
  ];
  const structureHits = STRUCTURE_MARKERS.filter((marker) =>
    lowerText.includes(marker)
  ).length;

  // Lexical density = content words / total words
  const FUNCTION_WORDS = [
    "the", "and", "or", "but", "if", "then", "a", "an", "in", "on", "to", "of", "with", "is", "was", "be"
  ];
  const functionWordSet = new Set(FUNCTION_WORDS);
  const contentWordCount = words.filter(
    (w) => !functionWordSet.has(w.toLowerCase())
  ).length;
  const lexicalDensity = parseFloat((contentWordCount / wordCount).toFixed(2));

  // Heuristic scoring
  const lengthScore = Math.min(wordCount / 300, 1);
  const academicScore = Math.min(academicHits / 6, 1);
  const structureScore = Math.min(structureHits / 3, 1);
  const lexicalScore = Math.min(lexicalDensity, 1);

  // Weighted scoring
  const rawScore =
    0.4 * academicScore +
    0.2 * lengthScore +
    0.2 * lexicalScore +
    0.2 * structureScore;

  const confidenceScore = parseFloat(rawScore.toFixed(2));
  const isQuizWorthy = confidenceScore >= 0.5;

  const reasons: string[] = [];
  if (academicHits < 2) reasons.push("Lacks academic keywords.");
  if (structureHits === 0) reasons.push("No academic structure indicators.");
  if (lexicalDensity < 0.45) reasons.push("Low lexical density (too informal or functional).");
  if (wordCount < 200) reasons.push("Short length (under 200 words).");

  return {
    isQuizWorthy,
    confidenceScore,
    reasons: isQuizWorthy ? [] : reasons,
    debug: { wordCount, academicHits, structureHits, lexicalDensity },
  };
};
