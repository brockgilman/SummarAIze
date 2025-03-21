import {signInWithEmailAndPassword} from "firebase/auth";  
import { auth } from "./firebaseConfig";

signInWithEmailAndPassword(auth, email, password) 
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
      alert("Logged in successfully!");
      navigate("/homepage");