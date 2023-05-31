// firebase.ts

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfaGLmZUfeP5OgUSMyKxPHFRjB9xkP3kg",
  authDomain: "library-xpress.firebaseapp.com",
  projectId: "library-xpress",
  storageBucket: "library-xpress.appspot.com",
  messagingSenderId: "122873158754",
  appId: "1:122873158754:web:5d56ba3096746f7b44c53b",
  measurementId: "G-07X2CEZ6JM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(app);
