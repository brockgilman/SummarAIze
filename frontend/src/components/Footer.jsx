import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ isFixed = false }) => {
  return (
    <footer className={`footer ${isFixed ? 'footer-fixed' : ''}`}>
      <div className="footer-content">
        <div className="footer-copyright">
          © 2025 SummarAIze
        </div>
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <a 
            href="https://github.com/brockgilman/SummarAIze" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 