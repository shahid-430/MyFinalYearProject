// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "loginmycart-627ba.firebaseapp.com",
  projectId: "loginmycart-627ba",
  storageBucket: "loginmycart-627ba.firebasestorage.app",
  messagingSenderId: "602951392088",
  appId: "1:602951392088:web:4809ea3a3fdb12dc98a32d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth , provider}