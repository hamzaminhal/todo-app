// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFJ2Xiz99doPayW68GEQEI5_5wvsR87K0",
  authDomain: "todo-app-a1bb4.firebaseapp.com",
  projectId: "todo-app-a1bb4",
  storageBucket: "todo-app-a1bb4.firebasestorage.app",
  messagingSenderId: "358864568638",
  appId: "1:358864568638:web:90bcbf92e58f2f21592c6f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, getAuth, app, db };
