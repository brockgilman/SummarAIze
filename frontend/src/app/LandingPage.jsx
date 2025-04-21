'use client';

import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/firebase/firebaseConfig';

export default function LandingPage() {
  const [showRememberMeNote, setShowRememberMeNote] = useState(false);

  useEffect(() => {
    document.body.classList.add('landing-page');

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const rememberMe =
      getCookie("rememberMe") === "true" ||
      localStorage.getItem("rememberMe") === "true";

    const fromExtension =
      new URLSearchParams(window.location.search).get("fromExtension") === "true";

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (fromExtension) {
          console.log("Redirecting: from extension & user is signed in");
          window.location.href = "/summaries";
        } else if (rememberMe) {
          console.log("Redirecting: user is remembered & signed in");
          window.location.href = "/summaries";
        } else {
          console.log("User signed in but not remembered");
        }
      } else if (fromExtension) {
        console.log("From extension, but user not signed in");
        setShowRememberMeNote(true);
      }
    });

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
              src="/summarAIzevideoclip.gif"
              alt="SummarAIze Demo"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
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
