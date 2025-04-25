// Import the functions you need from the SDKs you needZ
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import{getDatabase}from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";



import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgNxSUp3-JiJgrSIAThxZcD7__yTyZ6fU",
  authDomain: "auth-55978.firebaseapp.com",
  databaseURL: "https://auth-55978-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auth-55978",
  storageBucket: "auth-55978.firebasestorage.app",
  messagingSenderId: "521867895391",
  appId: "1:521867895391:web:66a9377268815c17f6f1ea",
  measurementId: "G-1B639ZD1JY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app);
const database=getDatabase(app);
export{app,analytics,auth,database}