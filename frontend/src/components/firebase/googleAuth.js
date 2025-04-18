import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Handles Google signup and stores user in Firestore
export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      console.warn("No user returned from Google sign-in");
      return;
    }

    const user = result.user;
    console.log("Signed in:", user.displayName);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "No name",
        email: user.email || "No email",
        provider: "google",
      });
      console.log("User added to Firestore");
    } else {
      console.log("User already exists in Firestore");
    }

    // Redirect after sign-in
    navigate("/summaries");
  } catch (error) {
    console.error("Google Sign-up Error:", error.message);
  }
};

export default handleGoogleSignup;
