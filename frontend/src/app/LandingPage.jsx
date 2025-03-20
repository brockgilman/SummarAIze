import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";
import { useEffect } from 'react';

export default function LandingPage() {
  // Add landing-page class to body element
  useEffect(() => {
    // Add the class to the body when component mounts
    document.body.classList.add('landing-page');
    
    // Function to get cookie by name
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
    
    // Check if auth cookie exists (replace 'authToken' with your actual cookie name)
    const authCookie = getCookie('extension_user_uid');
    
    // If user is already logged in, redirect to homepage
    if (authCookie) {
      window.location.href = '/homepage';
    }
    
    // Remove the class when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content Section */}
      <main className="flex-grow">
        <div className="flex-container">
          {/* Textbox (Left Half) */}
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
          
          {/* GIF Container (Right Half) */}
          <div className="gif-container">
            <img
              src="/summarizeimportant.gif"
              alt="SummarAIze Demo"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
        Trusted by UF students and researchers
      </footer>
    </div>
  );
}