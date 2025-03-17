import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navbar />

      <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-12 lg:py-20 space-y-8 lg:space-y-0">
        {/* Text Section */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-relaxed text-gray-900">
            AI-powered summaries<br />
            that enhance your<br />
            understanding and<br />
            accelerate your learning.
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
            Work with an AI partner that helps you extract key insights⁠—⁠to simplify long articles, clarify challenging content, and keep your reading efficient.
          </p>

          <SignupButtons />
        </div>

        {/* GIF Section */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img 
            src="summarizeimportant.gif" 
            alt="SummarAIze Demo" 
            className="w-3/4 lg:w-[70%] rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Centered Authors' Names */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xl text-gray-700 text-center">
          By: Brock Gilman, Kyle Scarmack, Shri Kumarasri, and Leo Cherevko
        </p>
      </div>
    </main>
  );
}
