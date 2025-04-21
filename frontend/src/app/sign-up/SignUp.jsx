import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { GoogleIcon } from "./components/CustomIcons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { handleGoogleSignup } from "../../components/firebase/googleAuth";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase/firebaseConfig";
import { getUserID } from "../../components/firebase/firebaseUserID";
import { setDoc, doc } from "firebase/firestore";
import LogoNavbar from "../../components/LogoNavbar";
import bcrypt from "bcryptjs";

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
  boxShadow:
    "hsla(0, 0.00%, 100.00%, 0.05) 0px 5px 15px 0px, hsla(0, 0.00%, 100.00%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "90vh",
  width: "100vw",
  marginTop: "80px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
}));

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
      borderColor: PRIMARY_COLOR,
    },
  },
  "& label.Mui-focused": {
    color: PRIMARY_COLOR,
  },
});

export default function SignUp() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("signup-page");
    return () => {
      document.body.classList.remove("signup-page");
    };
  }, []);

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nameError || emailError || passwordError) return;
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      getUserID(async (uid) => {
        if (uid) {
          try {
            await setDoc(doc(db, "users", uid), {
              name,
              email,
              password: hashedPassword,
              rememberMe: false,
              emailUpdates,
            });
            console.log("User data stored in Firestore.");
          } catch (error) {
            console.error("Error storing user data:", error.message);
          }
        }
      });

      navigate("/summaries");
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <LogoNavbar />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
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
              control={
                <Checkbox
                  checked={emailUpdates}
                  onChange={() => setEmailUpdates(!emailUpdates)}
                  color="primary"
                />
              }
              label="I want to receive updates via email."
            />

            <Button
              id="submit"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ backgroundColor: PRIMARY_COLOR, color: "#ffffff" }}
            >
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
              <Link
                href="/login"
                variant="body2"
                sx={{ color: PRIMARY_COLOR, alignSelf: "center" }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}
