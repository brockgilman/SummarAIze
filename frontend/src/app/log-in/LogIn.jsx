// Import React core features and hooks
import React, { useEffect, useState } from 'react';

// Import Material UI components for layout and styling
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard
} from '@mui/material';

// Import styling utility from MUI
import { styled } from '@mui/material/styles';

// Import custom components
import ForgotPassword from './components/ForgotPassword';
import { GoogleIcon } from './components/CustomIcons';

// Import Google signup handler
import { handleGoogleSignup } from "../../components/firebase/googleAuth";

// Import router navigation hook
import { useNavigate } from "react-router-dom";

// Firebase auth and Firestore imports
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../components/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Import logo/navbar component
import LogoNavbar from "../../components/LogoNavbar";

// Import bcrypt for password comparison
import bcrypt from 'bcryptjs';

// Constants for cookie and styling
const COOKIE_AGE_DAYS = 7;
const PRIMARY_COLOR = "#0F2841";

// Styled Card component for login box
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  backgroundColor: "#ffffff",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.05), 0px 15px 35px -5px rgba(0, 0, 0, 0.05)",
  [theme.breakpoints.up("sm")]: {
    width: "clamp(300px, 90vw, 450px)",
  },
}));

// Styled container that wraps the entire login page content
const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "90vh",
  width: "100vw",
  marginTop: '80px',
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
}));

// Main login component
export default function LogIn() {
  // State for managing error messages and modal visibility
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Hook for navigating to other pages
  const navigate = useNavigate();

  // Add class to body on mount for styling
  useEffect(() => {
    document.body.classList.add('signin-page');
    return () => {
      document.body.classList.remove('signin-page');
    };
  }, []);

  // Handler to show ForgotPassword modal
  const handleClickOpen = () => setOpen(true);

  // Handler to close ForgotPassword modal
  const handleClose = () => setOpen(false);

  // Submit handler for login form
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!validateInputs()) return; // Stop if validation fails

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Sign in via Firebase
      const user = userCredential.user;

      // Get user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isPasswordValid = bcrypt.compareSync(password, userData.password); // Compare hashed password

        if (isPasswordValid) {
          // Store user data in localStorage
          localStorage.setItem('extension_user', JSON.stringify({
            uid: user.uid,
            rememberMe: rememberMe,
          }));
          
          localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

          // Set or clear cookies based on 'rememberMe'
          if (rememberMe) {
            document.cookie = `extension_user_uid=${user.uid}; path=/; max-age=${COOKIE_AGE_DAYS * 86400}; SameSite=None; Secure`;
            document.cookie = `rememberMe=true; path=/; max-age=${COOKIE_AGE_DAYS * 86400}; SameSite=None; Secure`;
          } else {
            document.cookie = `extension_user_uid=; path=/; max-age=0; SameSite=None; Secure`;
            document.cookie = `rememberMe=false; path=/; max-age=0; SameSite=None; Secure`;
          }

          // Redirect to main app
          navigate("/summaries");
        } else {
          throw new Error("Invalid password.");
        }
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Set error messages based on Firebase error codes
      let errorMessage = "Something went wrong. Please try again later.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        errorMessage = "The email or password you entered is incorrect.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "We couldn't find an account associated with this email.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many login attempts. Please try again later.";
      }

      alert(errorMessage);
    }
  };

  // Validate email and password fields before form submission
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  // Return JSX for login page layout
  return (
    <div>
      {/* Normalize CSS for consistency */}
      <CssBaseline enableColorScheme />
      <LogoNavbar /> {/* Top logo/navigation bar */}

      {/* Page container */}
      <SignInContainer direction="column">
        {/* Login card box */}
        <Card variant="outlined">
          {/* Header */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Log in
          </Typography>

          {/* Login form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            {/* Email input field */}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: PRIMARY_COLOR,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PRIMARY_COLOR,
                  },
                }}
              />
            </FormControl>

            {/* Password input field */}
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: PRIMARY_COLOR,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: PRIMARY_COLOR,
                  },
                }}
              />
            </FormControl>

            {/* Remember me checkbox */}
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
            </FormControl>

            {/* Forgot password modal */}
            <ForgotPassword open={open} handleClose={handleClose} />

            {/* Submit login button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{ backgroundColor: PRIMARY_COLOR, color: '#ffffff' }}
            >
              Log in
            </Button>

            {/* Forgot password link */}
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ color: PRIMARY_COLOR, alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>

          {/* Divider between form and Google login */}
          <Divider>or</Divider>

          {/* Google login and signup link */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleGoogleSignup(navigate)}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>

            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" variant="body2" sx={{ color: PRIMARY_COLOR }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
}
