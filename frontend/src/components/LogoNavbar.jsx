import React from 'react';
import './Navbar.css';
import Logo from './Logo';

const LogoNavbar = () => {
  return (
    <header className="header">
      <a href="/" className="logo flex items-center space-x-2">
      <Logo />
      <span className="text-gray-100 hover:text-gray-900">SummarAIze</span>
      </a>
    </header>
  );
};

export default LogoNavbar;
