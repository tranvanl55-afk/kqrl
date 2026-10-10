import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeu0ETCdGXW6axn0p4qJ-fypSf20XrLKU",
  authDomain: "kqrl-920a8.firebaseapp.com",
  projectId: "kqrl-920a8",
  storageBucket: "kqrl-920a8.firebasestorage.app",
  messagingSenderId: "246767709512",
  appId: "1:246767709512:web:316ea7809093220cd8d77d",
  measurementId: "G-L45WW9HBZS",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics chỉ chạy được trên trình duyệt hỗ trợ; kiểm tra trước khi khởi tạo
export const analyticsPromise = isSupported().then(ok => (ok ? getAnalytics(app) : null)).catch(() => null);
