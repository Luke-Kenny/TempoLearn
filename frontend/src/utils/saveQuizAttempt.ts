import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface QuizQuestion {
  type: "mcq" | "true_false" | "cloze" | "short_answer";
  question: string;
  options?: string[];
  answer: string | boolean;
  difficulty: "easy" | "medium" | "hard";
  cognitive_level: string;
  explanation?: string;
}

interface AnswerDetail {
  question: string;
  type: "mcq" | "true_false" | "cloze" | "short_answer";
  correctAnswer: string | boolean;
  userAnswer: string | boolean;
  isCorrect: boolean;
  difficulty: "easy" | "medium" | "hard";
  cognitive_level: string;
  explanation?: string | null;
  options?: string[] | null;
}

interface QuizAttempt {
  uid: string;
  materialId: string;
  score: number;
  total: number;
  percentage: number;
  answers: AnswerDetail[];
}

export const saveQuizAttempt = async (data: QuizAttempt) => {
  try {
    await addDoc(collection(db, "quiz_attempts"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log("Quiz attempt saved");
  } catch (error) {
    console.error("Failed to save quiz attempt:", error);
  }
};
