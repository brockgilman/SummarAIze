import SignupButton from './SignupButton';
import GoogleSignupButton from './GoogleSignupButton';

// Main component to render both sign-up buttons
export default function SignupButtons() {
  return (
    <div className="flex flex-row w-full max-w-md mx-auto"> 
      <SignupButton className="flex-1" />
      <GoogleSignupButton className="flex-1" />
    </div>
  );
}