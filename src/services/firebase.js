// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzQH9meP3umuB2gEaI5ww0hefkJZy3fLw",
  authDomain: "js4-gymapp.firebaseapp.com",
  projectId: "js4-gymapp",
  storageBucket: "js4-gymapp.firebasestorage.app",
  messagingSenderId: "1085484949350",
  appId: "1:1085484949350:web:b63bd58a00b43df30972a7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);