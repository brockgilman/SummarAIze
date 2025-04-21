import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookText, Trash2, User, LogOut, SquarePen } from 'lucide-react';
import './sidebar.css';
import SidebarLogo from './SidebarLogo';
import { getUserEmail } from './firebase/firebaseUserEmail';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

const Sidebar = () => {
  // Store authenticated user's email
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user email
    const unsubscribe = getUserEmail((email) => {
      setUserEmail(email);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handles user sign-out
  const handleSignOut = async (event) => {
    event.preventDefault();

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
    }

    // Clear auth-related cookie and rememberMe preference
    document.cookie = "extension_user_uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    localStorage.setItem("rememberMe", "false");

    console.log("Signed out, cookie and Remember Me cleared");

    navigate('/');
  };

  // Handles navigation from sidebar items
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar-container">
      {/* Sidebar logo linking to home */}
      <div className="sidebar-logo">
        <a href="/summaries" className="logo flex items-center space-x-2">
          <SidebarLogo />
          <span className="sidebar-logo-text">SummarAIze</span>
        </a>
      </div>

      {/* Navigation links */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item" onClick={() => handleNavigation('/summaries')}>
            <a href="/summaries" className="sidebar-nav-link">
              <BookText />
              <span className="sidebar-nav-text">My Summaries</span>
            </a>
          </li>
          <li className="sidebar-nav-item">
            <a href="/generate" className="sidebar-nav-link">
              <SquarePen />
              <span className="sidebar-nav-text">Generate Summary</span>
            </a>
          </li>
          <li className="sidebar-nav-item" onClick={() => handleNavigation('/trash')}>
            <a href="/trash" className="sidebar-nav-link">
              <Trash2 />
              <span className="sidebar-nav-text">Trash</span>
            </a>
          </li>
          <li className="sidebar-nav-item" onClick={() => handleNavigation('/account')}>
            <a href="/account" className="sidebar-nav-link">
              <User />
              <span className="sidebar-nav-text">Account</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer section: log out and show user email */}
      <div className="sidebar-footer">
        <a className="sidebar-footer-link" onClick={handleSignOut}>
          <LogOut />
          <span>Log Out</span>
        </a>
        {/* Show user email or loading status */}
        <div className="sidebar-user-email">
          {loading ? "Loading..." : userEmail || "No user logged in"}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
