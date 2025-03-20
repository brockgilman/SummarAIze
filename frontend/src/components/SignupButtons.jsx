import SignupButton from './SignupButton';
import GoogleSignupButton from './GoogleSignupButton';

export default function SignupButtons() {
  return (
    <div className="flex flex-row w-full max-w-md mx-auto gap-4"> {/* Use flex-row and gap for horizontal spacing */}
      <SignupButton className="flex-1" /> {/* Flexible width */}
      <GoogleSignupButton className="flex-1" /> {/* Flexible width */}
    </div>
  );
}