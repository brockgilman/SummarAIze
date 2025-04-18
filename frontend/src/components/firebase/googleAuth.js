import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) return;

    // Redirect immediately
    navigate("/summaries");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "Unnamed",
        email: user.email || "No email",
        provider: "google",
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    if (error.code !== "auth/popup-closed-by-user") {
      alert("Google sign-in failed: " + error.message);
    }
    console.error("Google Sign-up Error:", error.message);
  }
};

export default handleGoogleSignup;
