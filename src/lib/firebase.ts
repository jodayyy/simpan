import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhQywKgSnHTZ136arR9Flkt3P92RC1itI",
  authDomain: "sunsent-simpan.firebaseapp.com",
  projectId: "sunsent-simpan",
  storageBucket: "sunsent-simpan.firebasestorage.app",
  messagingSenderId: "121761941508",
  appId: "1:121761941508:web:030f53b60946be26a40d51",
  measurementId: "G-JG0JY4P68F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
