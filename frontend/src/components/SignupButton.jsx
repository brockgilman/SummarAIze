import { useNavigate } from "react-router-dom";

// Button component to handle sign-up (with email)
export default function SignupButton() {
  const navigate = useNavigate();

  // Navigate to sign-up page
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
