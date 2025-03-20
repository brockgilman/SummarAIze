import React, { useEffect } from 'react';
import TextBox from "../components/Textbox";
import { getUserID } from "../components/firebase/firebaseUserID";
import LogoNavbar from '../components/LogoNavbar';


const HomePage = () => {
  useEffect(() => {
    // Set up cookie creation when component mounts
    const unsubscribe = getUserID((uid) => {
      if (uid) {
        // Create cookie with the user's UID
        setCookie('extension_user_uid', uid, 30); // Cookie expires in 30 days
        console.log('User ID cookie created:', uid);
      } else {
        console.log('No user authenticated');
      }
    });

    // Clean up the auth listener when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Empty dependency array ensures this runs once on component mount

  // Helper function to set cookie
  const setCookie = (name, value, days) => {
    let expires = '';
    
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    // Set cookie with SameSite=None and Secure flags to make it accessible from extension
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=None; Secure`;
    console.log("Cookie online"); 
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <LogoNavbar />
      <h1>Saved Summaries</h1>
    </div>
  );
};

export default HomePage;