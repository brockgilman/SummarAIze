import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";
import { GoogleIcon } from '../app/sign-in/components/CustomIcons'; // Assuming you have a GoogleIcon component
import { useEffect } from 'react';

export default function LandingPage() {
  // Add landing-page class to body element
  useEffect(() => {
    // Add the class to the body when component mounts
    document.body.classList.add('landing-page');
    
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
    </div>
  );
}