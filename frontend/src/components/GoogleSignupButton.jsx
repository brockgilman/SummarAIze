import { useNavigate } from "react-router-dom";
import { handleGoogleSignup } from "./firebase/googleAuth";

export default function GoogleSignupButton() {
  const navigate = useNavigate();

  return (
    <button
      className="border border-[#0F2841] bg-white text-[#0F2841] px-6 py-3 rounded-md flex items-center justify-center text-lg w-full sm:w-auto"
      onClick={() => handleGoogleSignup(navigate)}
    >
      <img src="/googleLogo.svg" alt="Google Logo" className="w-4 h-4" />
      <span className="ml-2 text-lg">Sign up with Google</span>
    </button>
  );
}