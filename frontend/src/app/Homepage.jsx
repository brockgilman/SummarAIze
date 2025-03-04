import './globals.css';
import SignupButtons from "../components/SignupButtons";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800"> {/* Set the text color for the whole page */}
  <Navbar />
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-8">
    <div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-gray-900">
        AI-powered summaries that enhance your understanding and accelerate your learning.
      </h1>

      <p className="text-lg md:text-xl mb-10 text-gray-700">
        Work with an AI partner that helps you extract key insights⁠—⁠to simplify long articles, clarify challenging content, and keep your reading efficient.
      </p>

      <SignupButtons />
    </div>

    <div className="text-center mt-24 mb-12">
      <p className="text-xl text-gray-700">By: Brock Gilman, Kyle Scarmack, Shri Kumarasri, and Leo Cherevko</p>
    </div>
  </div>
</main>

  );
}
