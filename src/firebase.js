// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "weatherapp-bcf33.firebaseapp.com",
  projectId: "weatherapp-bcf33",
  storageBucket: "weatherapp-bcf33.appspot.com",
  messagingSenderId: "895004511341",
  appId: "1:895004511341:web:52a442f2cb3f1a9b6ac364"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export { auth }