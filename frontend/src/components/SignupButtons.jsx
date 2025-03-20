import SignupButton from './SignupButton';
import GoogleSignupButton from './GoogleSignupButton';

export default function SignupButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
    <SignupButton />
    <GoogleSignupButton />
    </div>
  );
}