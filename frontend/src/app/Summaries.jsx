import React, { useEffect } from 'react';
import { getUserID } from "../components/firebase/firebaseUserID";
import Sidebar from "../components/Sidebar";

const Summaries = () => {
  // Manage user sessions and cookies based on remember me preference
  useEffect(() => {
    const unsubscribe = getUserID((uid) => {
      let storedUser = null;

      try {
        storedUser = JSON.parse(localStorage.getItem("extension_user"));
      } catch (err) {
        console.warn("Failed to parse extension_user from localStorage:", err);
      }

      const rememberMe = storedUser?.rememberMe === true;

      if (uid && rememberMe) {
        setCookie("extension_user_uid", uid, 7);
      } else {
        clearCookie("extension_user_uid");
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=None; Secure`;
  };

  const clearCookie = (name) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=None; Secure`;
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-blue-100">
      <Sidebar />
      <h1>Summaries</h1>
    </div>
  );
};

export default Summaries;