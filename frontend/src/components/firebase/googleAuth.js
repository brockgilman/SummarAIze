import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) return;

    // Reference to user document in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Unnamed",
        email: user.email || "No email",
        provider: "google",
      });
      console.log("User added to Firestore");
    } else {
      console.log("User already exists in Firestore");
    }

    navigate("/summaries");

  } catch (error) {
    console.error("Google Sign-up Error:", error.message);
    if (error.code !== 'auth/popup-closed-by-user') {
      alert("Google sign-in failed: " + error.message);
    }
  }
};

export default handleGoogleSignup;
