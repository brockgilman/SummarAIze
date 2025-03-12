import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function GoogleSignupButton() {
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // Redirect to the "HomePage" page after successful login
      navigate('/homepage');
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
    }
  };

  return (
    <button
      className="border border-[#0F2841] bg-white text-[#0F2841] px-6 py-3 rounded-md flex items-center justify-center text-lg w-full sm:w-auto"
      onClick={handleGoogleSignup}
    >
      {/* Reference the Google logo from the public folder */}
      <img src="/googleLogo.svg" alt="Google Logo" className="w-4 h-4" />
      <span className="ml-2 text-lg">Sign up with Google</span>
    </button>
  );
}
