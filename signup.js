import {auth,database}from "./firebase.js"
import{createUserWithEmailAndPassword}from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"
import{ref,set}from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js"

const form = document.getElementById("signup-form");
const message = document.getElementById("signup-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
 console.log(name)
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user)

    await set(ref(database,`users/${user.uid}`),{name,email})

    message.style.color = "green";
    message.innerText = "Signup successful! Redirecting to login...";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    message.style.color = "red";
    message.innerText = error.message;
  }
});





