import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Handles Google signup and stores user in Firestore
export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
      });
    }

    navigate("/summaries");
  } catch (error) {
    console.error(error);
  }
};

export default handleGoogleSignup;
