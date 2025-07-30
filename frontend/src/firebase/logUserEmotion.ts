import { db } from "./firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const logUserEmotion = async ({
  uid,
  emotion,
  reason,
  materialId,
}: {
  uid: string;
  emotion: string;
  reason: string;
  materialId?: string;
}) => {
  return await addDoc(collection(db, "emotion_logs"), {
    uid,
    emotion,
    reason,
    materialId: materialId || null,
    timestamp: serverTimestamp(),
  });
};
