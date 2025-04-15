import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookText, Trash2, User, LogOut, SquarePen } from 'lucide-react';
import './sidebar.css';
import SidebarLogo from './SidebarLogo';
import { getUserEmail } from './firebase/firebaseUserEmail';

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate();

  // Fetch user email from Firebase Authentication
  useEffect(() => {
    const unsubscribe = getUserEmail((email) => {
      setUserEmail(email); // Set user email when user is logged in
      setLoading(false); // Set loading to false after authentication state is determined
    });

    // Cleanup the observer on unmount
    return () => unsubscribe();
  }, []); // Only run once on component mount

  const handleSignOut = (event) => {
    event.preventDefault();
    document.cookie = "extension_user_uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    console.log("Cookie cleared");

    navigate('/'); // Redirect to home page
  };

  // Navigate to specific page based on click
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the provided path
  };

  // Show a loading message while Firebase is initializing
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar-container">
      {/* Logo section */}
      <div className="sidebar-logo">
        <a href="/summaries" className="logo flex items-center space-x-2">
          <SidebarLogo />
          <span className="sidebar-logo-text">SummarAIze</span>
        </a>
      </div>

      {/* Main navigation */}
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

      {/* Footer with sign out */}
      <div className="sidebar-footer">
        <a className="sidebar-footer-link" onClick={handleSignOut}>
          <LogOut />
          <span>Log Out</span>
        </a>
        {/* Display user email */}
        <div className="sidebar-user-email">
          {userEmail ? userEmail : "No user logged in"} {/* Display email or message */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
