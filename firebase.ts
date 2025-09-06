// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZYKZZNONZzTtqB7grknRfaHZopKkCRlI",
  authDomain: "notezy-f2680.firebaseapp.com",
  projectId: "notezy-f2680",
  storageBucket: "notezy-f2680.firebasestorage.app",
  messagingSenderId: "347940722367",
  appId: "1:347940722367:web:968f6ac1a9df478376580a",
  measurementId: "G-39RCY9C8FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);