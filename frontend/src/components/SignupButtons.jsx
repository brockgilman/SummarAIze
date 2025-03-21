import SignupButton from './SignupButton';
import GoogleSignupButton from './GoogleSignupButton';

export default function SignupButtons() {
  return (
    <div className="flex flex-row w-full max-w-md mx-auto"> 
      <SignupButton className="flex-1" />
      <GoogleSignupButton className="flex-1" />
    </div>
  );
}