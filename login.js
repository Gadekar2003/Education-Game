import {auth,database}from "./firebase.js"
import{signInWithEmailAndPassword}from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"
import{ref,set,get}from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js"

const loginForm=document.getElementById('loginForm');

loginForm.addEventListener("submit",async(e)=>{
   e.preventDefault();
   const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
   try {
    const userCredential=await signInWithEmailAndPassword(auth,email,password);
    const user=userCredential.user;
    const userRef=ref(database,`users/${user.uid}`)
    const snapshot=await get(userRef)
    if(snapshot.exists()){
      const userData=snapshot.val;

      loginForm.reset();
      window.location.href="./dashboard.html"
    }
   } catch (error) {
    console.log(error);
   }
})
