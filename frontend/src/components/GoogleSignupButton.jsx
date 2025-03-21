"use client";

import { useNavigate } from "react-router-dom";
import { handleGoogleSignup } from "./firebase/googleAuth"; // Ensure this is correct
import { GoogleIcon } from "../app/sign-up/components/CustomIcons";  // Ensure this is correct

export default function GoogleSignupButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => handleGoogleSignup(navigate)}
      style={{ 
        backgroundColor: "white", // White fill
        color: "grey", // Grey text color
        border: "1px solid grey", // Grey outline
        width: "100%", // Take up full width of parent container
        height: "50px", // Same height as SignupButton
        display: "flex", // Use flexbox for centering
        justifyContent: "center", // Horizontally center
        alignItems: "center", // Vertically center
        gap: "10px", // Space between the icon and text
      }}
      className="rounded-md hover:opacity-90 transition-opacity"
    >
      <GoogleIcon /> {/* Google Icon */}
      <span className="text-xl font-semibold">Sign up with Google</span>
    </button>
  );
}