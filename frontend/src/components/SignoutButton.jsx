import { useNavigate } from 'react-router-dom';

export default function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    document.cookie = "extension_user_uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    console.log("Cookie cleared");

    navigate('/');
  };

  return (
    <button 
      onClick={handleSignOut} 
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
    >
      Sign Out
    </button>
  );
}
