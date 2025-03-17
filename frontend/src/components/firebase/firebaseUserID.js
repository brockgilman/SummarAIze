import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Function to listen for user authentication state changes
export const getUserID = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.uid); // Pass the UID to the callback
    } else {
      callback(null); // No user logged in
    }
  });

  return unsubscribe; // Allow cleanup if needed
};