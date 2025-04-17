import { auth, db } from "./firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export const getUserName = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null)

    try {
      const docSnap = await getDoc(doc(db, "users", user.uid))
      callback(docSnap.exists() ? docSnap.data().name || null : null)
    } catch {
      callback(null)
    }
  })
}
