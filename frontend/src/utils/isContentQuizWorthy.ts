/**
 * Evaluates whether a piece of academic content is suitable for quiz generation.
 * Uses heuristic scoring based on structure, semantics, and lexical features.
 */

interface EvaluationResult {
  isQuizWorthy: boolean;
  confidenceScore: number; // 0.00 - 1.00
  reasons: string[];
  debug?: {
    wordCount: number;
    academicHits: number;
    structureHits: number;
    lexicalDensity: number;
    disallowedHits: string[];
  };
}

export const isContentQuizWorthy = (text: string): EvaluationResult => {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      isQuizWorthy: false,
      confidenceScore: 0,
      reasons: ["Input is empty or invalid."],
    };
  }

  const cleanedText = text.trim();
  const lowerText = cleanedText.toLowerCase();
  const words = cleanedText.split(/\s+/);
  const wordCount = words.length;

  // Blocked phrases (boilerplate detection)
  const BLOCKED_PHRASES = [
    "assignment brief", "assessment criteria", "marking rubric",
    "turnitin", "submission deadline", "file naming convention", "plagiarism policy",
    "this page is intentionally left blank", "student id", "submission portal",
    "how to submit", "contact your instructor", "canvas", "moodle"
  ];
  const disallowedHits = BLOCKED_PHRASES.filter((phrase) =>
    lowerText.includes(phrase)
  );

  if (disallowedHits.length > 0) {
    return {
      isQuizWorthy: false,
      confidenceScore: 0,
      reasons: [`Contains blocked instructional content: "${disallowedHits[0]}"`],
      debug: { wordCount, academicHits: 0, structureHits: 0, lexicalDensity: 0, disallowedHits },
    };
  }

  // Academic keywords (expanded list)
  const ACADEMIC_TERMS = [
    "hypothesis", "methodology", "literature review", "framework", "empirical", "quantitative", "qualitative",
    "findings", "dataset", "case study", "variable", "correlation", "inference", "observation", "experiment",
    "conceptual", "analysis", "evaluation", "significance", "construct", "paradigm", "results", "evidence",
    "discussion", "implication", "research question", "theoretical"
  ];
  const academicHits = ACADEMIC_TERMS.filter(term => lowerText.includes(term)).length;

  // Structural signals
  const STRUCTURE_MARKERS = [
    "abstract", "introduction", "methodology", "methods", "results", "discussion", "references", "bibliography", "conclusion"
  ];
  const structureHits = STRUCTURE_MARKERS.filter(marker =>
    lowerText.includes(marker)
  ).length;

  // Lexical Density Calculation
  const FUNCTION_WORDS = new Set([
    "the", "and", "or", "but", "if", "then", "a", "an", "in", "on", "to", "of", "with", "is", "was", "are", "be", "by", "this"
  ]);
  const contentWords = words.filter(w => !FUNCTION_WORDS.has(w.toLowerCase()));
  const lexicalDensity = parseFloat((contentWords.length / wordCount).toFixed(2));

  // Heuristic Scoring
  const lengthScore = Math.min(wordCount / 250, 1); // scale up to 250 words
  const academicScore = Math.min(academicHits / 5, 1);
  const structureScore = Math.min(structureHits / 3, 1);
  const lexicalScore = Math.min(lexicalDensity, 1);

  const weightedScore = (
    0.35 * academicScore +
    0.25 * lexicalScore +
    0.20 * lengthScore +
    0.20 * structureScore
  );

  const confidenceScore = parseFloat(weightedScore.toFixed(2));
  const isQuizWorthy = confidenceScore >= 0.4;

  // Reason feedback
  const reasons: string[] = [];
  if (wordCount < 150) reasons.push("Very short content (under 150 words).");
  if (academicHits < 2) reasons.push("Few academic keywords detected.");
  if (structureHits === 0) reasons.push("Lacks recognizable academic structure.");
  if (lexicalDensity < 0.4) reasons.push("Low lexical density (overly functional or casual).");

  return {
    isQuizWorthy,
    confidenceScore,
    reasons: isQuizWorthy ? [] : reasons,
    debug: {
      wordCount,
      academicHits,
      structureHits,
      lexicalDensity,
      disallowedHits
    }
  };
};
