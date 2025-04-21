import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Days to persist cookie
const COOKIE_AGE_DAYS = 7;

export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) return;

    // Set rememberMe to true for Google sign-ins
    localStorage.setItem("rememberMe", "true");

    // Set persistent UID and rememberMe cookies
    document.cookie = `extension_user_uid=${user.uid}; path=/; max-age=${COOKIE_AGE_DAYS * 86400}; SameSite=None; Secure`;
    document.cookie = `rememberMe=true; path=/; max-age=${COOKIE_AGE_DAYS * 86400}; SameSite=None; Secure`;

    // Create user doc if it doesn’t exist
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

    // Navigate to summaries page
    navigate("/summaries");

  } catch (error) {
    if (error.code !== "auth/popup-closed-by-user") {
      alert("Google sign-in failed: " + error.message);
    }
    console.error("Google Sign-up Error:", error.message);
  }
};

export default handleGoogleSignup;
