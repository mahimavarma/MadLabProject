// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGa128N32EqfMlZUBdecwcHZskmTTH20I",
  authDomain: "recipefinder-12246.firebaseapp.com",
  databaseURL: "https://recipefinder-12246-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "recipefinder-12246",
  storageBucket: "recipefinder-12246.firebasestorage.app",
  messagingSenderId: "751892580106",
  appId: "1:751892580106:web:1e4f96ab3daa3e87685cf3",
  measurementId: "G-1TXD9DZBSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore and export it

// Export auth and db for use in other parts of the application
export { auth, db }; // Export both auth and db
