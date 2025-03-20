"use client";

import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Import arrow icon

export default function SignupButton() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <button
      onClick={handleSignup}
      style={{ 
        backgroundColor: "#0F2841", 
        color: "white",
        width: "100%", // Take up full width of parent container
        height: "50px", // Fixed height
        display: "flex", // Use flexbox for centering
        justifyContent: "center", // Horizontally center
        alignItems: "center", // Vertically center
        gap: "10px", // Space between the icon and text
      }}
      className="rounded-md hover:opacity-90 transition-opacity"
    >
      <span className="text-xl font-semibold">Sign up, It's free</span>
      <ArrowForwardIcon style={{ fontSize: "1.2rem", verticalAlign: "middle" }} /> {/* Adjusted icon size and alignment */}
    </button>
  );
}