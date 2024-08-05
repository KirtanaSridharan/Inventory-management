// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  enableNetwork, getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCz8MAOdkr4kOz6AaAiC8VNzikMu2l9dDs",
  authDomain: "inventory-management-36bcc.firebaseapp.com",
  projectId: "inventory-management-36bcc",
  storageBucket: "inventory-management-36bcc.appspot.com",
  messagingSenderId: "408666258253",
  appId: "1:408666258253:web:8f243d7621a0bc28fcd504",
  measurementId: "G-GMB2BB80B0"
};



const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);



export {firestore};