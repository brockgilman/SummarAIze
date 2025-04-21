import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/firebase/firebaseConfig';

export default function LandingPage() {
  // State to control display of "remember me" session sync note
  // This note appears when the user is redirected from the extension
  const [showRememberMeNote, setShowRememberMeNote] = useState(false);

  useEffect(() => {
    // Apply landing page-specific style
    document.body.classList.add('landing-page');

    // Check for rememberMe flag
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // Check URL query param (?rememberMe=true) to show session sync note
    const params = new URLSearchParams(window.location.search);
    if (params.get("rememberMe") === "true") {
      setShowRememberMeNote(true);
    }

    let unsubscribe = () => {};

    // If user opted into "remember me", listen for Firebase auth state
    if (rememberMe) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is signed in:", user.email);
          // Redirect to the summaries page if user is authenticated
          window.location.href = '/summaries';
        } else {
          console.log("No user signed in");
        }
      });
    } else {
      console.log("rememberMe is false");
    }
    
    // Cleanup function to unsubscribe from auth state listener
    return () => {
      unsubscribe();
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="flex-container">
          <div className="textbox">
            {showRememberMeNote && (
              <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded text-blue-800 text-sm">
                Welcome back! Please log in again to sync your session from the extension.
              </div>
            )}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-gray-900">
              AI-powered summaries<br />
              that enhance your<br />
              understanding and<br />
              accelerate your learning.
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
              Work with an AI partner that helps you extract key insights⁠—⁠to simplify long articles, clarify challenging content, and keep your reading efficient.
            </p>
            <div className="mt-8">
              <SignupButtons />
            </div>
          </div>
          <div className="gif-container">
            <img
              src="/summarizeimportant.gif"
              alt="SummarAIze Demo"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>
      <footer className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
        Trusted by UF students and researchers
      </footer>
    </div>
  );
}
