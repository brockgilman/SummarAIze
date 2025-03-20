import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAleyi6x0_zmRsK5jxYUlFZqa05w-ZfPfE",
  authDomain: "summaraize-8487f.firebaseapp.com",
  databaseURL: "https://summaraize-8487f-default-rtdb.firebaseio.com",
  projectId: "summaraize-8487f",
  storageBucket: "summaraize-8487f.firebasestorage.app",
  messagingSenderId: "1028628209671",
  appId: "1:1028628209671:web:c1a6e86f0d0dce74cf8aa2",
  measurementId: "G-RX2TVGDTHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export Firebase services
export const auth = getAuth(app);
export { db };
export default app;
