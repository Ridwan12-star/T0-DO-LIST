// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxf6oEBe1UTrtGn4h7HFotB-OApU44dB8",
  authDomain: "todopwa-216d6.firebaseapp.com",
  projectId: "todopwa-216d6",
  storageBucket: "todopwa-216d6.firebasestorage.app",
  messagingSenderId: "723449000148",
  appId: "1:723449000148:web:e96aedae5e481ff5894b41",
  measurementId: "G-9K1QNVEG9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
