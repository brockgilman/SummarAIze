"use client";

import { useNavigate } from "react-router-dom";
import { handleGoogleSignup } from "./firebase/googleAuth";
import { GoogleIcon } from "../app/sign-up/components/CustomIcons";

export default function GoogleSignupButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => handleGoogleSignup(navigate)}
      className="google-signup-button flex items-center justify-center gap-2 w-full h-12 rounded-md text-xl font-semibold transition-all"
    >
      <GoogleIcon />
      Sign up with Google
    </button>
  );
}
