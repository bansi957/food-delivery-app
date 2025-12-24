// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "swiggy-food-delivery-c34bb.firebaseapp.com",
  projectId: "swiggy-food-delivery-c34bb",
  storageBucket: "swiggy-food-delivery-c34bb.firebasestorage.app",
  messagingSenderId: "837213183536",
  appId: "1:837213183536:web:a38745705a1675244797f5",
  measurementId: "G-SPFB9HYJWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}