import { generateQuiz } from "../src/services/quizService";
import assert from "node:assert";
import test from "node:test";

test("generateQuiz returns mocked questions", async () => {
  const mockClient = {
    chat: {
      completions: {
        create: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  {
                    type: "mcq",
                    question: "What is 2+2?",
                    answer: "4",
                    difficulty: "easy",
                    cognitive_level: "remember",
                    options: ["4", "3", "5", "2"]
                  },
                  {
                    type: "true_false",
                    question: "The sky is blue.",
                    answer: true,
                    difficulty: "easy",
                    cognitive_level: "remember"
                  },
                  {
                    type: "mcq",
                    question: "What is 3x3?",
                    answer: "9",
                    difficulty: "easy",
                    cognitive_level: "apply",
                    options: ["9", "6", "3", "12"]
                  },
                  {
                    type: "true_false",
                    question: "Fire is cold.",
                    answer: false,
                    difficulty: "easy",
                    cognitive_level: "understand"
                  },
                  {
                    type: "mcq",
                    question: "Which is a fruit?",
                    answer: "Apple",
                    difficulty: "easy",
                    cognitive_level: "remember",
                    options: ["Apple", "Carrot", "Potato", "Onion"]
                  }
                ])
              }
            }
          ]
        })
      }
    }
  };

  const quiz = await generateQuiz("x".repeat(200), "easy", mockClient as any);
  assert.strictEqual(quiz.length, 5);
  assert.strictEqual(quiz[0].question, "What is 2+2?");
});
