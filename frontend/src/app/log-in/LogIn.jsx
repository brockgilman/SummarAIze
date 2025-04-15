import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
import { GoogleIcon } from './components/CustomIcons';
import { handleGoogleSignup } from "../../components/firebase/googleAuth";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../components/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import LogoNavbar from "../../components/LogoNavbar"
import bcrypt from 'bcryptjs';

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  backgroundColor: "#ffffff",
  boxShadow: "hsla(0, 0.00%, 100.00%, 0.05) 0px 5px 15px 0px, hsla(0, 0.00%, 100.00%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "90vh",
  width: "100vw",
  padding: 0,
  margin: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "-10vh",
  backgroundColor: "#f0f0f0",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}))

export default function LogIn(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    document.body.classList.add('signin-page');
    return () => {
      document.body.classList.remove('signin-page');
    };
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

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
          // Save to database whether user wants to be remembered
          localStorage.setItem('extension_user', JSON.stringify({
            uid: user.uid,
            rememberMe: rememberMe
          }));
  
          if (rememberMe) {
            // Cookie will trigger for 7 days
            document.cookie = `extension_user_uid=${user.uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=None; Secure`;
          } else {
            // Clear any existing cookie in case user previously selected remember me
            document.cookie = `extension_user_uid=; path=/; max-age=0`;
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
    
      // Handle Firebase auth error codes with specific messages
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
    <div>
      <CssBaseline enableColorScheme />
      <LogoNavbar />
      <SignInContainer direction="column">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Log in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
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
              />
            </FormControl>
            <FormControl>
              {/* Remember Me Checkbox */}
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                label="Remember me"
              />
            </FormControl>
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button type="submit" fullWidth variant="contained" onClick={validateInputs} sx={{ backgroundColor: '#0F2841', color: '#ffffff'}}>
              Log in
            </Button>
            {/* Forgot Password Popup */}
            <Link component="button" type="button" onClick={handleClickOpen} variant="body2" sx={{ color: '#0F2841', alignSelf: 'center' }}>
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Google Sign In Button */}
            <Button fullWidth variant="outlined" onClick={() => handleGoogleSignup(navigate)} startIcon={<GoogleIcon />}>
              Sign in with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              {/* Redirect to Signup page */}
              <Link href="/signup" variant="body2" sx={{ color: '#0F2841', alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
}
