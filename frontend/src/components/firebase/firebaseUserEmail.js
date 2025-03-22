import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Function to listen for user authentication state changes and get the user's email
export const getUserEmail = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.email); // Pass the email to the callback
    } else {
      callback(null); // No user logged in
    }
  });

  return unsubscribe; // Allow cleanup if needed
};