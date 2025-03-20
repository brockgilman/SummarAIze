// This file would be part of your web application, not the Chrome extension
// You would deploy this as an API endpoint that your extension can call

import { db } from '../firebase/firebaseConfig';
import { collection, doc, addDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      userId, 
      'paper-link': paperLink,
      'summary-content': summaryContent,
      'summary-length': summaryLength,
      'summary-tone': summaryTone
    } = req.body;

    // Validate required fields
    if (!userId || !paperLink || !summaryContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Reference to the user's summaries subcollection
    const summariesRef = collection(db, 'users', userId, 'summaries');

    // Add a new document to the summaries subcollection
    const docRef = await addDoc(summariesRef, {
      'paper-link': paperLink,
      'summary-content': summaryContent,
      'summary-length': summaryLength,
      'summary-tone': summaryTone,
      createdAt: serverTimestamp()
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Summary saved successfully',
      summaryId: docRef.id
    });
  } catch (error) {
    console.error('Error saving summary:', error);
    return res.status(500).json({ 
      error: 'Failed to save summary', 
      message: error.message 
    });
  }
}