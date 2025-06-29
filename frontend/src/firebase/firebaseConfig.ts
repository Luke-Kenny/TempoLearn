import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJWFdw_pLhn0-GcHMsF_ipLpBZp8px89c",
  authDomain: "tempolearn.firebaseapp.com",
  projectId: "tempolearn",
  storageBucket: "tempolearn.firebasestorage.app",
  messagingSenderId: "145645791246",
  appId: "1:145645791246:web:34ff3c075b6e284805745f",
  measurementId: "G-5XRY7KEEJB"
};

// Initializes Firebase App
const app = initializeApp(firebaseConfig);

// Exports Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
