import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const handleGoogleSignup = async (navigate) => {
  try {
    const provider = new GoogleAuthProvider();

    // Set persistent login session
    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (!user) return;

    // Reference user document
    const userRef = doc(db, "users", user.uid);

    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "Unnamed",
          email: user.email || "No email",
          provider: "google",
          rememberMe: true,
        });
        console.log("User added to Firestore");
      } else {
        console.log("User already exists in Firestore");
      }
    } catch (firestoreError) {
      console.error("Firestore write failed:", firestoreError);
    }

    // Store local session info
    localStorage.setItem(
      "extension_user",
      JSON.stringify({
        uid: user.uid,
        rememberMe: true,
      })
    );

    document.cookie = `extension_user_uid=${user.uid}; path=/; max-age=604800`; // 7 days

    // Redirect after Firestore write
    navigate("/summaries");

  } catch (error) {
    console.error("Google Sign-up Error:", error.message);
    if (error.code !== "auth/popup-closed-by-user") {
      alert("Google sign-in failed: " + error.message);
    }
  }
};

export default handleGoogleSignup;
