import React from 'react';
import './Navbar.css';
import Logo from './Logo';

const Navbar = () => {

  // Function to handle the redirection to Chrome Web Store
  const handleGetSummarAIze = () => {
      window.location.href = 'https://chromewebstore.google.com/';
  };

  return (
    <header className="header">
      <a href="/" className="logo flex items-center space-x-2">  {/* Use flex for horizontal layout */}
        <Logo />  {/* Logo component renders the SVG */} 
      </a>

      <nav className="navbar">
        <a href="/features" className="text-gray-700 hover:text-gray-900">Features</a>
        <a href="/demo" className="text-gray-700 hover:text-gray-900">Demo</a>
        <a href="/about" className="text-gray-700 hover:text-gray-900">About</a>
        <a href="/login" className="text-gray-700 font-semibold hover:text-gray-900">Log in</a>
        
        {/* "Get SummarAIze" Button */}
        <button
          onClick={handleGetSummarAIze} // Redirects to Chrome Web Store
          className="bg-[#0F2841] text-white px-6 py-3 rounded-md flex items-center justify-center text-lg w-full sm:w-auto"
        >
          Get SummarAIze
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
