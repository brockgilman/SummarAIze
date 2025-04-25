import React from 'react';
import './Navbar.css';
import Logo from './Logo';

const Navbar = () => {
  // TODO: Function to redirect user to SummarAIze extension on Chrome webstore
  const handleGetSummarAIze = () => {
      window.location.href = 'https://chromewebstore.google.com/detail/nlpbgjhkmgeocnplhoigfiiopfpckebc?utm_source=item-share-cb';
  };

  // Navbar elements and page redirects
  return (
    <header className="header">
      <a href="/" className="logo flex items-center space-x-2">
      <Logo />
      <span className="text-gray-100 hover:text-gray-900">SummarAIze</span>
      </a>

      <nav className="navbar">
        <a href="/features" className="text-gray-700 hover:text-gray-900">Features</a>
        <a href="/demo" className="text-gray-700 hover:text-gray-900">Demo</a>
        <a href="/about" className="text-gray-700 hover:text-gray-900">About</a>
        <a href="/login" className="text-gray-700 font-semibold hover:text-gray-900">Log in</a>
        
        <button
          onClick={handleGetSummarAIze}
          className="bg-[#0F2841] text-white px-6 py-3 rounded-md flex items-center justify-center text-lg w-full sm:w-auto"
        >
          Get SummarAIze, It's free -&gt;
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
