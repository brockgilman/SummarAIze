import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import {getFirestore, setDoc, doc} from "firebase/firestore"

// Submit button
const submit = document.getElementById("submit");
submit.addEventListener('click', function (event) {
  event.preventDefault()
  alert(5)
})