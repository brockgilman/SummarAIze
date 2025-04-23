const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// This is the new function you added
exports.deleteOldTrashedSummaries = functions.pubsub
    .schedule("every 24 hours")
    .timeZone("America/New_York")
    .onRun(async (context) => {
      const now = new Date();
      const threshold = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
      );

      try {
        const usersSnapshot = await db.collection("users").get();

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const summariesRef = db
              .collection("users")
              .doc(userId)
              .collection("summaries");

          const trashedQuery = await summariesRef
              .where("trashedAt", "<=", threshold)
              .get();

          for (const summaryDoc of trashedQuery.docs) {
            await summariesRef.doc(summaryDoc.id).delete();

            console.log(
                `Deleted summary ${summaryDoc.id} for user ${userId}`,
            );
          }
        }

        return null;
      } catch (error) {
        console.error("Deletion error:", error);

        throw new Error(
            `Failed to delete old trashed summaries: ${error.message}`,
        );
      }
    });

// Define Express app in a function to avoid execution at module scope
const createApp = () => {
  // Initialize Express
  const app = express();

  // Enable CORS for all routes (Important for Chrome extensions)
  app.use(cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  // Parse JSON bodies
  app.use(express.json());

  // Debug middleware to log all requests
  app.use((req, res, next) => {
    console.log(`[D] Received ${req.method} request to: ${req.originalUrl}`);
    next();
  });

  // Root route - API documentation
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the SummarAIze API",
      version: "1.0.0",
      endpoints: {
        "/api/test": "GET - Test if the API is working",
        "/api/save-summary": "POST - Save a new summary"
      }
    });
  });

  // Firebase Function - Save Summary
  app.post("/api/save-summary", async (req, res) => {
    try {
      console.log("Received request:", req.body);

      const {
        userId,
        "paper-link": paperLink,
        "summary-content": summaryContent,
        "summary-length": summaryLength,
        "summary-tone": summaryTone,
      } = req.body;

      // Validate required fields
      if (!userId || !paperLink || !summaryContent) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      // Reference to user's summaries subcollection
      const userRef = db.collection("users").doc(userId);
      const summariesRef = userRef.collection("summaries");

      // Add new document to summaries subcollection
      const docRef = await summariesRef.add({
        "paper-link": paperLink,
        "summary-content": summaryContent,
        "summary-length": summaryLength,
        "summary-tone": summaryTone,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Summary saved with ID: ${docRef.id}`);

      return res.status(200).json({
        success: true,
        message: "Summary saved successfully",
        summaryId: docRef.id,
      });
    } catch (error) {
      console.error("Error saving summary:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to save summary",
        message: error.message,
      });
    }
  });

  // Firebase Function - Test Endpoint
  app.get("/api/test", (req, res) => {
    res.json({message: "API is working!"});
  });

  // Catch-all route for undefined endpoints
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "Endpoint not found",
      message: `The requested endpoint ${req.originalUrl} does not exist`,
      availableEndpoints: ["/", "/api/test", "/api/save-summary"],
    });
  });

  return app;
};

// Export the Express app wrapped in an HTTPS function
exports.api = functions.https.onRequest(createApp());