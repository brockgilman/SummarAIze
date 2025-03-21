"use client";

import { useNavigate } from "react-router-dom";

export default function SignupButton() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <button
      onClick={handleSignup}
      className="signup-button flex items-center justify-center gap-2 w-full h-12 rounded-md text-xl font-semibold transition-all"
    >
      Sign up, It's free -&gt;
    </button>
  );
}
