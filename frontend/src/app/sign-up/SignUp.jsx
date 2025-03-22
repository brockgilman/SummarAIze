"use client"

import * as React from "react"
import { useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import Link from "@mui/material/Link"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiCard from "@mui/material/Card"
import { styled } from "@mui/material/styles"
import { GoogleIcon } from "./components/CustomIcons"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../components/firebase/firebaseConfig"
import { handleGoogleSignup } from "../../components/firebase/googleAuth";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase/firebaseConfig";
import { getUserID } from "../../components/firebase/firebaseUserID";
import { setDoc, doc } from "firebase/firestore";
import LogoNavbar from "../../components/LogoNavbar"

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "90vh",
  width: "100vw",
  padding: 0, // Ensures no extra padding
  margin: 0, // Ensures no extra margin
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "-10vh", // Moves the card upwards
  backgroundColor: "#f0f0f0",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}))

// Custom styled TextField with white background
const WhiteTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  },
})

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("")
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("")
  const [nameError, setNameError] = React.useState(false)
  const [nameErrorMessage, setNameErrorMessage] = React.useState("")

  // Add signup-page class to body element
  useEffect(() => {
    // Add the class to the body when component mounts
    document.body.classList.add('signup-page');
    
    // Remove the class when component unmounts
    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

  const validateInputs = () => {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const name = document.getElementById("name")

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage("Please enter a valid email address.")
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage("")
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage("Password must be at least 6 characters long.")
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage("")
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true)
      setNameErrorMessage("Name is required.")
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage("")
    }

    return isValid
  }

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    // Check if there are any validation errors
    if (nameError || emailError || passwordError) {
      return; // Don't proceed if there are errors
    }
  
    // Get form data
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
  
    // Validate inputs before proceeding
    if (!validateInputs()) return;
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
  
      // Get the user UID and store the email/password under their UID
      getUserID(async (uid) => {
        if (uid) {
          try {
            await setDoc(doc(db, "users", uid), {
              email: email,
              password: password, // TODO: Use hashing for password
            });
            console.log("User data stored in Firestore.");
          } catch (error) {
            console.error("Error storing user data:", error.message);
          }
        }
      });  
      navigate("/summaries"); // Redirect to homepage
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message); // Show Firebase error message
    }
  };  
  return (
    <>
      <CssBaseline enableColorScheme />
      <LogoNavbar />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <WhiteTextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <WhiteTextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <WhiteTextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
           <Button id="submit" type="submit" fullWidth variant="contained" onClick={validateInputs} sx={{ backgroundColor: '#0F2841', color: '#ffffff'}}>
            Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleGoogleSignup(navigate)}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/login" variant="body2" sx={{ color: '#0F2841', alignSelf: "center" }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  )
}