import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface QuizAttempt {
    uid: string;
    materialId: string;
    score: number;
    total: number;
    percentage: number;
    answers: string[];
    quizData: {
        question: string;
        options: string[];
        answer: string;
    }[];
}

// Adding a new collection to firestore which contains quiz analytics
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