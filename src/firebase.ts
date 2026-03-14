import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtHCavR1b3Bmqnw1ruh6oy0VvbFSlV5mw",
  authDomain: "ai-tools-34e77.firebaseapp.com",
  projectId: "ai-tools-34e77",
  storageBucket: "ai-tools-34e77.firebasestorage.app",
  messagingSenderId: "445198807884",
  appId: "1:445198807884:web:a6cd93378175a5692ad5e9",
  measurementId: "G-8S1ZYP7NN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
