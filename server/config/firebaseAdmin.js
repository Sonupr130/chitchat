import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { app } from "../config/firebase-client.js"; // Different from admin config

// Client-side auth only
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Login Data", result);
    return result.user;
  } catch (error) {
    console.log(error);
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
    console.error("Logout Error:", error);
    throw error;
  }
};