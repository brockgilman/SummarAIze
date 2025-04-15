import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Function to use Firebase's Google authentication provider to sign in users
export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/summaries");
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
  }
};

export default handleGoogleSignup;