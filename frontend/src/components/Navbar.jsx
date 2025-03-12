import React from 'react'
import './Navbar.css'
import Logo from './Logo';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className = "header">
      <Link href="/" className="logo flex items-center space-x-2">  {/* Use flex for horizontal layout */}
        <Logo />  {/* Logo component renders the SVG */} 
      </Link>

      <nav className="navbar">
        <a href="/" className="text-gray-700 hover:text-gray-900">Features</a>
        <a href="/" className="text-gray-700 hover:text-gray-900">Demo</a>
        <a href="/" className="text-gray-700 hover:text-gray-900">About</a>
        <a href="/" className="text-gray-700 font-semibold hover:text-gray-900 ">Log in</a>
        <a href="/">Get SummarAIze</a>
        </nav>
    </header>
  )
}

export default Navbar
