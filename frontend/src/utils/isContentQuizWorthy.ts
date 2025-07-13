// lightweight rule-based content filter for pdf system
// This is to ensure only suitable inputs are used for quiz

export const isContentQuizWorthy = (text: string): boolean => {
  const minWords = 150;

  const disqualifyingPatterns = [
    /submit (by|before)/i,
    /assignment brief/i,
    /assessment criteria/i,
    /marking rubric/i,
    /due date/i,
    /plagiarism/i,
    /learning outcome/i,
    /how to submit/i,
    /turnitin/i,
    /grading/i,
  ];

  const wordCount = text.trim().split(/\s+/).length;
  const containsDisallowed = disqualifyingPatterns.some((pattern) =>
    pattern.test(text)
  );

  return wordCount >= minWords && !containsDisallowed;
};
