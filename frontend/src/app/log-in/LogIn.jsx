import React, { useEffect, useState } from 'react';
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
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
import { GoogleIcon } from './components/CustomIcons';
import { handleGoogleSignup } from "../../components/firebase/googleAuth";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../components/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import LogoNavbar from "../../components/LogoNavbar";
import bcrypt from 'bcryptjs';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const COOKIE_AGE_DAYS = 7;
const PRIMARY_COLOR = "#0F2841";

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "90vh",
  width: "100vw",
  marginTop: '22px',
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
}));

export default function LogIn() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('signin-page');
    return () => {
      document.body.classList.remove('signin-page');
    };
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const isPasswordValid = bcrypt.compareSync(password, userData.password);

        if (isPasswordValid) {
          localStorage.setItem('extension_user', JSON.stringify({
            uid: user.uid,
            rememberMe: rememberMe,
          }));

          localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

          if (rememberMe) {
            document.cookie = `extension_user_uid=${user.uid}; path=/; max-age=${COOKIE_AGE_DAYS * 86400}; SameSite=None; Secure`;
            document.cookie = `rememberMe=true; path=/; max-age=${COOKIE_AGE_DAYS * 86400}; SameSite=None; Secure`;
          } else {
            document.cookie = `extension_user_uid=; path=/; max-age=0; SameSite=None; Secure`;
            document.cookie = `rememberMe=false; path=/; max-age=0; SameSite=None; Secure`;
          }

          navigate("/summaries");
        } else {
          throw new Error("Invalid password.");
        }
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      console.error("Login Error:", error);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CssBaseline enableColorScheme />
        <LogoNavbar />
        <SignInContainer direction="column">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Log in
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
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

              <ForgotPassword open={open} handleClose={handleClose} />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
                sx={{ backgroundColor: PRIMARY_COLOR, color: '#ffffff' }}
              >
                Log in
              </Button>

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

            <Divider>or</Divider>

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
      </main>
      <Footer />
    </div>
  );
}
