// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCxf6oEBe1UTrtGn4h7HFotB-OApU44dB8",
  authDomain: "todopwa-216d6.firebaseapp.com",
  projectId: "todopwa-216d6",
  storageBucket: "todopwa-216d6.firebasestorage.app",
  messagingSenderId: "723449000148",
  appId: "1:723449000148:web:e96aedae5e481ff5894b41",
  measurementId: "G-9K1QNVEG9L"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Todo Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a task pending!',
    icon: '/favicon.ico' // Optional: set your PWA icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

