import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveSummary = async (summaryData) => {
  try {
    // Get the userId from the summaryData
    const { userID } = summaryData;
    
    if (!userID) {
      throw new Error("User ID is required to save a summary");
    }
    
    // Create a reference to the summaries subcollection for this user
    const summariesCollectionRef = collection(db, "users", userID, "summaries");
    
    const docRef = await addDoc(summariesCollectionRef, {
      "paper-link": summaryData["paper-link"],
      "summary-content": summaryData["summary-content"],
      "summary-length": summaryData["summary-length"],
      "summary-tone": summaryData["summary-tone"],
      createdAt: serverTimestamp(), // Timestamp for sorting
    });

    console.log("Summary saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving summary:", error);
    throw error;
  }
};