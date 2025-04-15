import { getAuth, sendPasswordResetEmail} from "firebase/auth";
import { auth } from "./firebaseConfig";

const reset = document.getElementById("reset");
reset.addEventListener("click", function(event) {
    event.preventDefault()

    const email = document.getElementById("email").value;
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then(() => {
        // Password reset email sent!
        // ..
        alert("Password reset email sent! Please check your inbox.");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        alert(errorMessage)
    });

})
