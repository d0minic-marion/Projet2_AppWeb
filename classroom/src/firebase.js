import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBodGJhzuEyspVrz8x9jel_k-YyXK6biOk",
  authDomain: "ex01-ee413.firebaseapp.com",
  projectId: "ex01-ee413",
  storageBucket: "ex01-ee413.firebasestorage.app",
  messagingSenderId: "1076967840090",
  appId: "1:1076967840090:web:a7c8a3c972350bb53abb63",
  measurementId: "G-6WLKJ9BKWD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, provider, db, storage };