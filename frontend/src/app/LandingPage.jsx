'use client';
import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";
import { useEffect } from 'react';

export default function LandingPage() {
  useEffect(() => {
    document.body.classList.add('landing-page');

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    const authCookie = getCookie('extension_user_uid');

    // Check if rememberMe is set to true in localStorage
    let rememberMe = false;
    try {
      const storedUser = JSON.parse(localStorage.getItem('extension_user'));
      rememberMe = storedUser?.rememberMe === true;
    } catch (err) {
      console.warn('Could not parse extension_user from localStorage:', err);
    }

    if (authCookie && rememberMe) {
      window.location.href = '/summaries';
    }

    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="flex-container">
          <div className="textbox">
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
