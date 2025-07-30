import { db } from "./firebaseConfig";
import { getDocs, query, where, collection } from "firebase/firestore";

export const getUserQuizAttempts = async (uid: string) => {
  const ref = collection(db, "quiz_attempts");
  const q = query(ref, where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
