// services/authService.ts
//The async keyword is used in JavaScript/TypeScript to declare an asynchronous function.
//An asynchronous function always returns a Promise.
//Inside an async function, you can use await to pause execution until another Promise is resolved.
//async makes a function return a Promise.

//await pauses execution until the Promise is resolved or rejected.

//Use try...catch with async/await for better error handling.

//You don’t have to use async if you just return the Promise directly, but it’s cleaner.

// Think of async/await like saying:
//“Wait here until Firebase is done, then continue.”

// services/authService.ts

// Make sure your firebase.ts exports 'auth' like: export const auth = getAuth(app);
// If not, import the correct export (e.g., default or named)
import { auth } from "@/firebase"; // use named import for 'auth'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

// Register user
export const register = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Login user
export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Logout user
export const logout = async () => {
  return await signOut(auth);
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
