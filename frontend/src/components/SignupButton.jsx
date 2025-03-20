import { useNavigate } from 'react-router-dom';

export default function SignupButton() {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate("/signup"); // Redirects to the signup page when clicked
      };

  return (
    <button
        onClick={handleSignup}
      className="bg-[#0F2841] text-white px-6 py-3 rounded-md flex items-center justify-center text-lg w-full sm:w-auto"
    >
      Sign up <span className="ml-1 text-xs sm:text-sm">It's free</span>
    </button>
  );
}

