/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAtHCavR1b3Bmqnw1ruh6oy0VvbFSlV5mw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-tools-34e77.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-tools-34e77",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-tools-34e77.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "445198807884",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:445198807884:web:a6cd93378175a5692ad5e9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8S1ZYP7NN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
