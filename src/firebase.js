// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVhqWoPPh926c20Yd2j90dfuY6yCUyLuA",
  authDomain: "citysocial-697ea.firebaseapp.com",
  projectId: "citysocial-697ea",
  storageBucket: "citysocial-697ea.firebasestorage.app",
  messagingSenderId: "277706543834",
  appId: "1:277706543834:web:b470f9639895650c7a0be3",
  measurementId: "G-9EL6YKBNTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);