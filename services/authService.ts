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



// Make sure your firebase.ts exports 'auth' like: export const auth = getAuth(app);
// If not, import the correct export (e.g., default or named)

// services/authService.ts
import { auth, db } from "@/firebase"; // use named import for 'auth'
import { doc, getDoc, setDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";


// Initialize Firestore profile if it doesn't exist
export const initUserProfile = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  
 if (!userSnap.exists()) {
    const defaultName = user.email?.split("@")[0] || "User";

    await setDoc(userRef, {
      email: user.email,
      displayName: defaultName, // ✅ new field
      profileImage: null,
    });
    console.log("Firestore profile created for:", user.email);
  }
  


  // if (!userSnap.exists()) {
  //   await setDoc(userRef, {
  //     email: user.email,
  //     profileImage: null, // default null
  //   });
  //   console.log("Firestore profile created for:", user.email);
  // }
};

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

// // Subscribe to auth state changes
// export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
//   return onAuthStateChanged(auth, callback);
// };
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await initUserProfile(user); // ✅ create profile if missing
      } catch (err) {
        console.error("Failed to initialize Firestore profile:", err);
      }
    }
    callback(user);
  });
};
