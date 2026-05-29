// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // 👈 新增這行
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkRMdMk8oFugijn26pCcvlxECMIYyy3EQ",
  authDomain: "corlabo-eddac.firebaseapp.com",
  projectId: "corlabo-eddac",
  storageBucket: "corlabo-eddac.firebasestorage.app",
  messagingSenderId: "913133308523",
  appId: "1:913133308523:web:2241b63d3d61f1ca85bf2e",
  measurementId: "G-4MT9671TMW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 匯出驗證工具
export const googleProvider = new GoogleAuthProvider(); // 👈 匯出 Google 供應商
export const storage = getStorage(app);
