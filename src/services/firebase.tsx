// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUDs4ZJE5VUxEEsqrlS7eR52FWG6_46kI",
  authDomain: "focuszone-568cc.firebaseapp.com",
  projectId: "focuszone-568cc",
  storageBucket: "focuszone-568cc.firebasestorage.app",
  messagingSenderId: "374303258798",
  appId: "1:374303258798:web:7dad116748dbddcea3953f",
  measurementId: "G-2WWSHJFNR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);